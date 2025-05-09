import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouterSetup from './Router';  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterSetup />
  </StrictMode>,
)
