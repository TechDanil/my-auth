import { FunctionComponent, PropsWithChildren } from "react"

import { TanstackQueryProvider } from "./tanstack-query.provider"

export const MainProvider: FunctionComponent<PropsWithChildren> = (props) => {
  const { children } = props
  
  return (
    <TanstackQueryProvider>
      {children}
    </TanstackQueryProvider>
  )
} 