import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import VapiAI from './assets/pages/VapiAI'
import { VoiceWave } from './assets/pages/VoiceWave'

createRoot(document.getElementById('vapi')).render(
  <StrictMode>
    <VapiAI />
  </StrictMode>,
)

createRoot(document.getElementById('bg')).render(
  <StrictMode>
    <VoiceWave />
  </StrictMode>,
)