import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/taviraj/400.css'
import '@fontsource/taviraj/400-italic.css'
import '@fontsource/taviraj/600.css'
import '@fontsource/taviraj/700.css'
import '@fontsource/ibm-plex-sans-thai-looped/300.css'
import '@fontsource/ibm-plex-sans-thai-looped/400.css'
import '@fontsource/ibm-plex-sans-thai-looped/500.css'
import '@fontsource/ibm-plex-sans-thai-looped/600.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
