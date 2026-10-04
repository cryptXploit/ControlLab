import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeThemeListener } from '@/store/useThemeStore';
import { HapticService } from '@/services/haptics/HapticService';

initializeThemeListener();
HapticService.initGlobalHaptics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
