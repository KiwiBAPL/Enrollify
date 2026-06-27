import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { initAnalytics } from '@/lib/analytics'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

const root = document.getElementById('root')

if (root) {
  initAnalytics().then(() => {
    createRoot(root).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </QueryClientProvider>
      </StrictMode>,
    )
  })
}
