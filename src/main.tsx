import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@app/providers/layout/ThemeProvider';
import Routing from "@/routes/Index.tsx";
import {LayoutProvider} from "@app/providers/layout/LayoutProvider.tsx";
import {LocalDbGate} from "@/infrastructure/localDb/providers/LocalDbGate.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider>
          <LayoutProvider>
              <LocalDbGate>
                  <Routing />
              </LocalDbGate>
          </LayoutProvider>
      </ThemeProvider>
  </StrictMode>,
)
