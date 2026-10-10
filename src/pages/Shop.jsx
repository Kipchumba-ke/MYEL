import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { getProducts } from '../lib/data'
import ProductCard from '../components/ProductCard'

export default function Shop({ onPurchase }) {
  const [products, setProducts] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const category = searchParams.get('category') || 'All'
  useEffect(() => { getProducts().then(setProducts).catch(console.error) }, [])
  const categories = ['All', 'Necklaces', 'Rings', 'Bracelets', 'Earrings']
  const filtered = useMemo(() => products.filter(p => (category === 'All' || p.category === category || (category === 'New Arrivals' && p.featured) || (category === 'Best Sellers' && p.featured)) && p.name.toLowerCase().includes(search.toLowerCase())), [products, category, search])
  return <main className="shop-page"><div className="shop-intro"><p className="eyebrow">THE MYEL COLLECTION</p><h1>Objects to keep.<br/>Stories to tell.</h1><p>Fine jewelry, responsibly considered and made to last.</p></div>
    <div className="shop-toolbar"><div className="category-filters"><SlidersHorizontal size={16}/>{categories.map(c => <button key={c} className={category === c ? 'filter-active' : ''} onClick={() => setSearchParams(c === 'All' ? {} : { category: c })}>{c}</button>)}</div><input className="shop-search" placeholder="Search jewelry…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search products"/></div>
    <p className="results-count">{filtered.length} pieces</p>
    <div className="product-grid">{filtered.map(p => <ProductCard key={p.id} product={p} onPurchase={onPurchase}/>)}</div>
    {filtered.length === 0 && <div className="empty-state">No pieces found. Try another category or search.</div>}
  </main>
}