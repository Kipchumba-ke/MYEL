import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ShoppingBag, X, Minus, Plus } from 'lucide-react'
import Header from './components/Header'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { useAuth } from './context/AuthContext'
import { createOrder } from './lib/data'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [notice, setNotice] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  function purchase(product) {
    setSelectedProduct(product)
    if (!user) setAuthOpen(true)
    else {
      setCart(items => {
        const existing = items.find(i => i.id === product.id)
        return existing ? items.map(i => i.id === product.id ? {...i, quantity:i.quantity+1} : i) : [...items, {...product, quantity:1}]
      })
      setCartOpen(true)
    }
  }
  function updateQuantity(id, delta) {
    setCart(items => items.map(i => i.id === id ? {...i, quantity:i.quantity+delta} : i).filter(i => i.quantity > 0))
  }
  async function checkout() {
    if (!user) { setCartOpen(false); setAuthOpen(true); return }
    try {
      await createOrder(cart, cartTotal)
      setCart([]); setCartOpen(false); setNotice('Your order has been received. Thank you for choosing MYEL.')
    } catch (error) { setNotice(error.message) }
  }
  return <div className="app-shell">
    <Header cartCount={cartCount} onCart={() => { if (!user) setAuthOpen(true); else setCartOpen(true) }}/>
    <Routes>
      <Route path="/" element={<Home onPurchase={purchase}/>}/>
      <Route path="/shop" element={<Shop onPurchase={purchase}/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="*" element={<main className="not-found"><p className="eyebrow">404 · NOT FOUND</p><h1>This page wandered off.</h1><button className="button button-dark" onClick={() => navigate('/')}>BACK HOME</button></main>}/>
    </Routes>
    <Footer/>
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} product={selectedProduct}/>
    {cartOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setCartOpen(false)}><section className="cart-drawer"><div className="cart-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Shopping bag ({cartCount})</h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X/></button></div>{!cart.length ? <div className="empty-state"><ShoppingBag size={28}/><p>Your bag is waiting for something special.</p><button className="text-action" onClick={() => {setCartOpen(false);navigate('/shop')}}>EXPLORE THE COLLECTION ↗</button></div> : <><div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image_url} alt={item.name}/><div className="cart-item-info"><strong>{item.name}</strong><span>${Number(item.price).toLocaleString('en-CA')}</span><div className="quantity-control"><button onClick={() => updateQuantity(item.id,-1)} aria-label="Decrease quantity"><Minus size={14}/></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id,1)} aria-label="Increase quantity"><Plus size={14}/></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>${cartTotal.toLocaleString('en-CA',{minimumFractionDigits:2})}</strong></div><p className="muted">Shipping and taxes are calculated at checkout.</p><button className="button button-dark" onClick={checkout}>PLACE ORDER · ${cartTotal.toLocaleString('en-CA',{minimumFractionDigits:2})}</button></div></>}</section></div>}
    {notice && <div className="toast" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={16}/></button></div>}
  </div>
}