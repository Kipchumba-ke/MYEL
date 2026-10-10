import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingBag, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Header({ cartCount = 0, onCart }) {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`
  async function logout() { await signOut(); navigate('/') }
  return <>
    <div className="shipping-bar">Free shipping on orders over $150 in Kenya</div>
    <header className="site-header">
      <button className="icon-button mobile-menu" aria-label="Open menu" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={`nav-left ${open ? 'nav-open' : ''}`}>
        <NavLink className={linkClass} to="/shop" onClick={() => setOpen(false)}>SHOP BY</NavLink>
        <NavLink className={linkClass} to="/shop?category=Collections" onClick={() => setOpen(false)}>COLLECTIONS</NavLink>
      </nav>
      <Link to="/" className="wordmark" aria-label="MYEL home">MYEL</Link>
      <nav className={`nav-right ${open ? 'nav-open' : ''}`}>
        <NavLink className={linkClass} to="/about" onClick={() => setOpen(false)}>ABOUT US</NavLink>
        {isAdmin && <NavLink className={linkClass} to="/admin">ADMIN</NavLink>}
        {user ? <button className="nav-link" onClick={logout}>LOG OUT</button> : <NavLink className={linkClass} to="/login">LOGIN</NavLink>}
        <span className="language"><span>Fr</span> | En</span>
      </nav>
      <button className="icon-button cart-button" aria-label="Shopping bag" onClick={onCart}><ShoppingBag size={20}/>{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
    </header>
  </>
}