import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='client_id_to_be_replaced'>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
