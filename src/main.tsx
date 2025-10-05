import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient(); // Configurar reactQuery de forma global

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/* Aca instanciamos globalmente queryClient en toda la app */}
      <Router />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
