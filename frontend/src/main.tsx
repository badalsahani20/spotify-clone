import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ClerkProvider} from "@clerk/clerk-react"
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './providers/AuthProvider.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}> {/*the authentication library*/}
      <AuthProvider> {/*//It manages tokens*/}
        <BrowserRouter> {/*//Makes navigation work (/home, /login, etc.) without reloading the page.*/}
          <App />
        </BrowserRouter>
      </AuthProvider>
      </ClerkProvider>
  </StrictMode>,
)
