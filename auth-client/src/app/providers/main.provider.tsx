import { composeProviders } from './compose.provider'
import { TanstackQueryProvider } from './tanstack-query.provider'
import { ThemeProvider } from './theme.provider'
import { ToastProvider } from './toast.provider'

export const MainProvider = composeProviders([
  { component: TanstackQueryProvider },
  {
    component: ThemeProvider,
    props: {
      attribute: 'class',
      defaultTheme: 'light',
      disableTransitionOnChange: true,
      enableSystem: false
    }
  },
  { component: ToastProvider }
])
