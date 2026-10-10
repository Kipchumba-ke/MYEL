import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProducts } from '../lib/data'
import ProductCard from '../components/ProductCard'

const categories = [
  { name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85' },
  { name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85' },
  { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85' },
]
export default function Home({ onPurchase }) {
  const [products, setProducts] = useState([])
  useEffect(() => { getProducts().then(setProducts).catch(console.error) }, [])
  const featured = products.filter(p => p.featured).slice(0, 4)
  return <main>
    <section className="hero">
      <div className="hero-image" role="img" aria-label="Fine gold jewelry styled on a natural branch"/>
      <div className="hero-copy"><p className="eyebrow">RESPONSIBLE FINE JEWELRY · MADE IN KENYA</p><h1>Responsible high-end jewelry made in Kenya. MYEL creations are designed to stand the test of time.</h1><p className="hero-subtitle">Spontaneous, delicate, audacious, our jewels distinguish themselves with their elegance.</p><Link className="text-action hero-action" to="/shop">SHOP MYEL <ArrowUpRight size={16}/></Link></div>
      <div className="hero-side-note">A MODERN SIGNET RING <span>STACK THE NECKLACES</span></div>
    </section>
    <section className="section new-arrivals">
      <div className="section-heading"><div><p className="eyebrow">CONSIDERED OBJECTS, MADE TO LAST</p><h2>Shop new arrivals</h2></div><Link to="/shop" className="text-action">VIEW ALL <ArrowRight size={16}/></Link></div>
      <div className="product-grid">{(featured.length ? featured : products.slice(0, 4)).map(p => <ProductCard key={p.id} product={p} onPurchase={onPurchase}/>)}</div>
    </section>
    <section className="editorial-split"><div className="editorial-image"><img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85" alt="Gold and gemstone jewelry on textured fabric" loading="lazy"/><span>#EVERYGRAMCOUNTS</span></div><div className="editorial-copy"><p className="eyebrow">MADE WITH INTENTION</p><h2>Fairmined Gold: choose ethical gold.</h2><p>Jewelry should feel good in every sense. We value responsible materials, thoughtful craftsmanship, and pieces made to be treasured.</p><Link className="text-action" to="/about">OUR COMMITMENT <ArrowUpRight size={16}/></Link></div></section>
    <section className="section category-section"><div className="section-heading"><h2>Browse by categories</h2><Link to="/shop" className="text-action">SHOP ALL <ArrowRight size={16}/></Link></div><div className="category-grid">{categories.map(c => <Link to={`/shop?category=${c.name}`} className="category-card" key={c.name}><img src={c.image} alt={c.name} loading="lazy"/><span>{c.name}<ArrowUpRight size={18}/></span></Link>)}</div></section>
    <section className="values-banner"><span>Exceptional Quality</span><span>Fair Price</span><span>Made in Kenya</span></section>
    <section className="newsletter"><div><p className="eyebrow">A NOTE FROM MYEL</p><h2>Subscribe to<br/> our newsletter.</h2><p>Receive exclusive news and special promo codes.</p><form onSubmit={e => {e.preventDefault(); alert('Thank you for your interest in MYEL.')}}><input type="email" placeholder="Your email address" aria-label="Your email address" required/><button aria-label="Subscribe"><ArrowRight/></button></form></div></section>
  </main>
}