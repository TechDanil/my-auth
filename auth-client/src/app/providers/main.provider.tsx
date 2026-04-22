import { TanstackQueryProvider } from "./tanstack-query.provider"
import { ThemeProvider } from "./theme.provider"
import { composeProviders } from "./compose.provider"

export const MainProvider = composeProviders([
  { component: TanstackQueryProvider },
  {
    component: ThemeProvider,
    props: {
      attribute: "class",
      defaultTheme: "light",
      disableTransitionOnChange: true,
    },
  },
])