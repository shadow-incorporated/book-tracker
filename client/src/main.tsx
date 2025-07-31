import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import App from './App.tsx'
import LoginPage from './pages/Login.tsx'
import RegisterPage from './pages/Registration.tsx'
import { Toaster } from 'sonner'
import AuthSuccess from './pages/AuthSuccess.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<App />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/auth/success' element={<AuthSuccess />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
)
