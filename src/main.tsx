import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAnalytics } from '@/lib/analytics'
import App from './App'
import './index.css'

const root = document.getElementById('root')

if (root) {
  initAnalytics().then(() => {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
