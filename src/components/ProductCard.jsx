import { ArrowUpRight } from 'lucide-react'
export default function ProductCard({ product, onPurchase }) {
  return <article className="product-card">
    <button className="product-image-button" onClick={() => onPurchase(product)} aria-label={`View ${product.name}`}>
      <img className="product-image" src={product.image_url} alt={product.name} loading="lazy" />
      <span className="product-open"><ArrowUpRight size={18}/></span>
    </button>
    <div className="product-info"><div><h3>{product.name}</h3><p>{product.category}</p></div><span className="product-price">${Number(product.price).toLocaleString('en-CA')}</span></div>
    <button className="text-action" onClick={() => onPurchase(product)}>VIEW PRODUCT <span>↗</span></button>
  </article>
}