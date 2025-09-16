import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Routing from "@/routes/Index.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Routing />
  </StrictMode>,
)
