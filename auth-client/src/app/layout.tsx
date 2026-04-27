import type { Metadata } from 'next'
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'

import { ToggleTheme } from '@/shared/components/ui'
import '@/shared/styles/globals.css'
import { cn } from '@/shared/utils/clsx'

import { MainProvider } from './providers'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Auth Client',
  description: 'Auth Client'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(
        'h-full antialiased',
        geistSans.className,
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable
      )}
    >
      <body className='bg-background text-foreground flex min-h-full flex-col'>
        <MainProvider>
          <div className='relative flex min-h-screen flex-col'>
            <ToggleTheme />
            <div className='flex h-screen w-full items-center justify-center px-4'>
              {children}
            </div>
          </div>
        </MainProvider>
      </body>
    </html>
  )
}
