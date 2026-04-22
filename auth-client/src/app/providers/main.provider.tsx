import { FunctionComponent, PropsWithChildren } from "react"

import { TanstackQueryProvider } from "./tanstack-query.provider"
import { ThemeProvider } from "./theme.provider"

export const MainProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props

  return (
    <TanstackQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </TanstackQueryProvider>
  )
} 