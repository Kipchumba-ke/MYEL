import { Link } from 'react-router-dom'
export default function Footer() {
  return <footer className="footer">
    <div className="footer-columns">
      <div><h3>Shop By</h3><div className="footer-link-grid"><Link to="/shop?category=Necklaces">Necklaces</Link><Link to="/shop?category=Rings">Rings</Link><Link to="/shop?category=Earrings">Earrings</Link><Link to="/shop?category=Bracelets">Bracelets</Link><Link to="/shop?category=Best Sellers">Best Sellers</Link><Link to="/shop?category=New Arrivals">New Arrivals</Link></div></div>
      <div><h3>Support</h3><Link to="/about">Product care</Link><Link to="/about">Returns, shipping & pricing</Link><Link to="/about">FAQ</Link></div>
      <div><h3>MYEL</h3><Link to="/about">About</Link><Link to="/about">Journal</Link><Link to="/about">Ethical stones</Link><Link to="/about">Terms & privacy</Link></div>
      <div><h3>Visit</h3><Link to="/about">The Store</Link><Link to="/about">Contact</Link></div>
    </div>
    <div className="footer-bottom"><div><h3>Social</h3><div className="social-links"><a href="https://instagram.com" target="_blank" rel="noreferrer">ig</a><a href="https://facebook.com" target="_blank" rel="noreferrer">f</a></div></div><span className="muted">Fr&nbsp; | &nbsp;En</span><span className="copyright">All rights reserved. © 2026 - MYEL</span><span className="muted">Made with care</span></div>
  </footer>
}