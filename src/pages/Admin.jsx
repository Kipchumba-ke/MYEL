import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BarChart3, Package, ShoppingCart, Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { getAdminProducts, getAdminOrders, saveProduct, deleteProduct, updateOrderStatus, demoProducts } from '../lib/data'
import { isSupabaseConfigured } from '../lib/supabase'

const blank = { name: '', category: 'Rings', price: '', image_url: '', description: '', featured: false, active: true, stock: 0 }
const money = value => `$${Number(value || 0).toLocaleString('en-CA', { maximumFractionDigits: 2 })}`

export default function Admin() {
  const { user, isAdmin, loading } = useAuth()
  const [tab, setTab] = useState('overview'), [products, setProducts] = useState([]), [orders, setOrders] = useState([]), [editing, setEditing] = useState(null), [form, setForm] = useState(blank), [message, setMessage] = useState(''), [busy, setBusy] = useState(false)
  async function refresh() {
    if (!isSupabaseConfigured) { setProducts(demoProducts); setOrders([]); return }
    try { const [p, o] = await Promise.all([getAdminProducts(), getAdminOrders()]); setProducts(p); setOrders(o) }
    catch (e) { setMessage(e.message) }
  }
  useEffect(() => { if (user && isAdmin) refresh() }, [user, isAdmin])
  if (loading) return <div className="admin-loading">Loading admin…</div>
  if (!user) return <Navigate to="/login" replace/>
  if (!isAdmin) return <main className="access-denied"><h1>Admin access required</h1><p>Your account does not have the administrator role.</p><p>An administrator must grant access securely in the Supabase database.</p></main>
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + Number(o.total || 0), 0)
  const chartData = Object.values(orders.reduce((acc, order) => { const day = new Date(order.created_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }); acc[day] ??= { day, revenue: 0, orders: 0 }; acc[day].revenue += Number(order.total || 0); acc[day].orders++; return acc }, {})).slice(-7)
  function openNew() { setEditing('new'); setForm(blank); setMessage('') }
  function openEdit(product) { setEditing(product.id); setForm({ ...product }); setMessage('') }
  async function submitProduct(e) {
    e.preventDefault(); setBusy(true); setMessage('')
    try { await saveProduct(form); setEditing(null); await refresh(); setMessage('Product saved successfully.') }
    catch (e) { setMessage(e.message) } finally { setBusy(false) }
  }
  async function removeProduct(product) {
    if (!window.confirm(`Remove "${product.name}" from the catalogue?`)) return
    try { await deleteProduct(product.id); await refresh(); setMessage('Product removed.') } catch (e) { setMessage(e.message) }
  }
  async function setStatus(order, status) {
    try { await updateOrderStatus(order.id, status); await refresh(); setMessage(`Order updated to ${status}.`) } catch (e) { setMessage(e.message) }
  }
  return <main className="admin-page">
    <div className="admin-heading"><div><p className="eyebrow">MYEL COMMERCE</p><h1>Store dashboard</h1><p className="muted">Manage your catalogue, orders, and store performance.</p></div><button className="button button-outline" onClick={refresh}><RefreshCw size={15}/> REFRESH</button></div>
    {!isSupabaseConfigured && <div className="notice">Demo preview: connect Supabase to securely manage real products and orders. Changes require a configured database.</div>}
    {message && <div className="notice" role="status">{message}</div>}
    <div className="admin-tabs">{[['overview','Overview',BarChart3],['products','Products',Package],['orders','Orders',ShoppingCart]].map(([key,label,Icon]) => <button key={key} className={tab === key ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab(key)}><Icon size={17}/>{label}</button>)}</div>
    {tab === 'overview' && <><div className="stats-grid"><div className="stat-card"><span>Total revenue</span><strong>{money(revenue)}</strong><small>From recorded orders</small></div><div className="stat-card"><span>Total orders</span><strong>{orders.length}</strong><small>{orders.filter(o => o.status === 'pending').length} awaiting attention</small></div><div className="stat-card"><span>Active products</span><strong>{products.filter(p => p.active).length}</strong><small>{products.length} catalogue items</small></div><div className="stat-card"><span>Average order</span><strong>{money(orders.length ? revenue / orders.length : 0)}</strong><small>Across recorded orders</small></div></div><section className="admin-panel"><div className="panel-heading"><div><h2>Sales activity</h2><p className="muted">Revenue by order date</p></div></div>{chartData.length ? <div className="chart-wrap"><ResponsiveContainer width="100%" height={280}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4dc"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip formatter={value => money(value)}/><Bar dataKey="revenue" fill="#b8a16b" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer></div> : <div className="empty-state">Your sales chart will appear once orders have been placed.</div>}</section><section className="admin-panel"><div className="panel-heading"><h2>Recent orders</h2><button className="text-action" onClick={() => setTab('orders')}>VIEW ALL ↗</button></div><OrderTable orders={orders.slice(0,5)} setStatus={setStatus}/></section></>}
    {tab === 'products' && <section className="admin-panel"><div className="panel-heading"><div><h2>Product catalogue</h2><p className="muted">Add new pieces, update prices, or remove products.</p></div><button className="button button-dark" onClick={openNew}><Plus size={16}/> ADD PRODUCT</button></div><div className="admin-product-list">{products.map(p => <div className="admin-product" key={p.id}><img src={p.image_url} alt={p.name}/><div className="admin-product-main"><strong>{p.name}</strong><span>{p.category} · Stock {p.stock ?? 0}</span></div><strong>{money(p.price)}</strong><span className={`status-pill ${p.active ? 'status-delivered' : 'status-cancelled'}`}>{p.active ? 'Active' : 'Hidden'}</span><div className="row-actions"><button aria-label={`Edit ${p.name}`} onClick={() => openEdit(p)}><Pencil size={16}/></button><button aria-label={`Delete ${p.name}`} onClick={() => removeProduct(p)}><Trash2 size={16}/></button></div></div>)}</div></section>}
    {tab === 'orders' && <section className="admin-panel"><div className="panel-heading"><div><h2>Customer orders</h2><p className="muted">Review incoming orders and update fulfilment status.</p></div></div><OrderTable orders={orders} setStatus={setStatus}/></section>}
    {editing && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setEditing(null)}><section className="product-editor"><button className="modal-close" onClick={() => setEditing(null)} aria-label="Close"><X/></button><p className="eyebrow">CATALOGUE MANAGEMENT</p><h2>{editing === 'new' ? 'Add a product' : 'Edit product'}</h2><form className="auth-form" onSubmit={submitProduct}><label>Product name<input required value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{['Necklaces','Rings','Bracelets','Earrings'].map(c => <option key={c}>{c}</option>)}</select></label><div className="form-row"><label>Price (CAD)<input required min="0" step="0.01" type="number" value={form.price} onChange={e => setForm({...form,price:e.target.value})}/></label><label>Stock<input min="0" type="number" value={form.stock ?? 0} onChange={e => setForm({...form,stock:e.target.value})}/></label></div><label>Image URL<input type="url" required value={form.image_url} onChange={e => setForm({...form,image_url:e.target.value})}/></label><label>Description<textarea rows="3" value={form.description || ''} onChange={e => setForm({...form,description:e.target.value})}/></label><div className="checkbox-row"><label><input type="checkbox" checked={Boolean(form.featured)} onChange={e => setForm({...form,featured:e.target.checked})}/> Featured</label><label><input type="checkbox" checked={Boolean(form.active)} onChange={e => setForm({...form,active:e.target.checked})}/> Visible in shop</label></div><button className="button button-dark" disabled={busy}>{busy ? 'SAVING…' : 'SAVE PRODUCT'}</button></form></section></div>}
  </main>
}

function OrderTable({ orders, setStatus }) {
  if (!orders.length) return <div className="empty-state">No orders yet. New customer orders will appear here.</div>
  return <div className="table-scroll"><table className="orders-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map(o => <tr key={o.id}><td>#{String(o.id).slice(0,8)}</td><td>{o.profiles?.full_name || 'Customer'}</td><td>{new Date(o.created_at).toLocaleDateString()}</td><td>{(o.order_items || []).reduce((sum,i) => sum + i.quantity,0)}</td><td>{money(o.total)}</td><td><select className="status-select" value={o.status} onChange={e => setStatus(o,e.target.value)}><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></td></tr>)}</tbody></table></div>
}