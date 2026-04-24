'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FunctionComponent, PropsWithChildren } from 'react'

export const TanstackQueryProvider: FunctionComponent<
    PropsWithChildren
> = props => {
    const { children } = props

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false
            }
        }
    })

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
