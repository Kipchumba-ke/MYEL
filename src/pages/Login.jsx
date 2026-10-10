import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('login'), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState(''), [message, setMessage] = useState(''), [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  async function submit(e) {
    e.preventDefault(); setMessage('')
    if (!isSupabaseConfigured) { setMessage('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local first.'); return }
    setBusy(true)
    try {
      const result = mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (result.error) throw result.error
      if (mode === 'signup') setMessage('Account created. Check your email for confirmation.')
      else navigate('/')
    } catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }
  if (user) return <main className="login-page"><p className="eyebrow">YOUR MYEL ACCOUNT</p><h1>You’re already signed in.</h1><Link to="/shop" className="button button-dark">CONTINUE SHOPPING</Link></main>
  return <main className="login-page"><p className="eyebrow">YOUR MYEL ACCOUNT</p><h1>{mode === 'login' ? 'Welcome back.' : 'Join MYEL.'}</h1><p className="muted">Sign in to save your details and place an order.</p><form className="auth-form" onSubmit={submit}>{mode === 'signup' && <label>Full name<input value={name} onChange={e => setName(e.target.value)} required autoComplete="name"/></label>}<label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"/></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/></label><button className="button button-dark" disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</button></form>{message && <p className="form-message" role="status">{message}</p>}<p className="switch-auth">{mode === 'login' ? 'New to MYEL?' : 'Already have an account?'} <button onClick={() => {setMode(mode === 'login' ? 'signup' : 'login'); setMessage('')}}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p><p className="fine-print">Secure authentication is handled by Supabase Auth.</p></main>
}