import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ open, onClose, product }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  if (!open) return null
  async function submit(e) {
    e.preventDefault(); setMessage('')
    if (!isSupabaseConfigured) { setMessage('Not configured yet'); return }
    setBusy(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setMessage('You are signed in. You can continue to checkout.')
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
        if (error) throw error
        setMessage('Account created. Check your email if confirmation is enabled, then sign in to continue.')
      }
    } catch (err) { setMessage(err.message || 'Something went wrong.') }
    finally { setBusy(false) }
  }
  return <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="modal-close" aria-label="Close" onClick={onClose}><X/></button>
      <p className="eyebrow">MYEL · YOUR ACCOUNT</p>
      <h2 id="auth-title">{user ? 'You’re signed in' : mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2>
      <p className="muted">{product ? `Sign in to purchase ${product.name}.` : 'Sign in for a thoughtful shopping experience.'}</p>
      {!user && <form onSubmit={submit} className="auth-form">
        {mode === 'signup' && <label>Full name<input value={name} onChange={e => setName(e.target.value)} required autoComplete="name"/></label>}
        <label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"/></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/></label>
        <button className="button button-dark" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</button>
      </form>}
      {message && <p className="form-message" role="status">{message}</p>}
      {!user && <p className="switch-auth">{mode === 'login' ? 'New to MYEL?' : 'Already have an account?'} <button onClick={() => {setMode(mode === 'login' ? 'signup' : 'login'); setMessage('')}}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p>}
      {user && <button className="button button-dark" onClick={onClose}>CONTINUE SHOPPING</button>}
    </section>
  </div>
}