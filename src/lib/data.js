import { supabase, isSupabaseConfigured } from './supabase'

export const demoProducts = [
  { id: 'demo-1', name: 'Stein Necklace in Silver with Aquamarine', category: 'Necklaces', price: 245, image_url: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85', description: 'A delicate silver necklace set with luminous aquamarine.', featured: true, active: true, stock: 8 },
  { id: 'demo-2', name: 'Origines Pendant in Yellow Gold', category: 'Necklaces', price: 390, image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85', description: 'An everyday pendant crafted with a thoughtful eye for detail.', featured: true, active: true, stock: 5 },
  { id: 'demo-3', name: 'Ethical Gold Signet Ring', category: 'Rings', price: 320, image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85', description: 'A modern signet ring with a timeless silhouette.', featured: false, active: true, stock: 6 },
  { id: 'demo-4', name: 'Pearl Chain Bracelet', category: 'Bracelets', price: 185, image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1000&q=85', description: 'A fine gold-tone chain accented with natural-looking pearls.', featured: true, active: true, stock: 12 },
  { id: 'demo-5', name: 'Sculpted Gold Hoop Earrings', category: 'Earrings', price: 210, image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85', description: 'Sculptural hoops designed to move effortlessly from day to evening.', featured: false, active: true, stock: 9 },
  { id: 'demo-6', name: 'Blue Stone Fine Ring', category: 'Rings', price: 460, image_url: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=1000&q=85', description: 'A blue centre stone framed in a refined, understated setting.', featured: true, active: true, stock: 3 },
]

export async function getProducts() {
  if (!isSupabaseConfigured) return demoProducts
  const { data, error } = await supabase.from('products').select('*').eq('active', true).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function getAdminProducts() {
  if (!isSupabaseConfigured) return demoProducts
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function saveProduct(product) {
  if (!supabase) throw new Error('Configure Supabase to manage products.')
  const payload = { name: product.name, category: product.category, price: Number(product.price), image_url: product.image_url, description: product.description, featured: Boolean(product.featured), active: Boolean(product.active), stock: Number(product.stock ?? 0) }
  const query = product.id ? supabase.from('products').update(payload).eq('id', product.id) : supabase.from('products').insert(payload)
  const { error } = await query
  if (error) throw error
}
export async function deleteProduct(id) {
  if (!supabase) throw new Error('Configure Supabase to manage products.')
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}
export async function createOrder(items, total) {
  if (!supabase) throw new Error('Configure Supabase to place orders.')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Please sign in before placing an order.')
  const { data: order, error } = await supabase.from('orders').insert({ user_id: user.id, total, status: 'pending' }).select().single()
  if (error) throw error
  const rows = items.map(item => ({ order_id: order.id, product_id: item.id, quantity: item.quantity, unit_price: item.price }))
  const { error: itemError } = await supabase.from('order_items').insert(rows)
  if (itemError) throw itemError
  return order
}
export async function getAdminOrders() {
  const { data, error } = await supabase.from('orders').select('*, profiles(full_name), order_items(quantity, unit_price, products(name))').order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function updateOrderStatus(id, status) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id)
  if (error) throw error
}
