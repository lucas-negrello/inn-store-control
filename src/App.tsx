import LayoutGeral from './layouts/LayoutGeral'
import { Typography } from '@mui/material'

export default function App() {
  return (
      <LayoutGeral>
        <Typography variant="h4" gutterBottom>
          Bem-vindo ao meu App com MUI!
        </Typography>
        <Typography>
          Este é o conteúdo principal da aplicação.
        </Typography>
      </LayoutGeral>
  )
}