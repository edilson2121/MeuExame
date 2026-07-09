import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'MeuExame - Plataforma de Estudos',
    template: '%s | MeuExame'
  },
  description: 'Plataforma de estudos para preparação de exames e concursos',
  keywords: ['estudos', 'exames', 'concursos', 'educação', 'plataforma'],
  authors: [{ name: 'MeuExame Team' }],
  creator: 'MeuExame',
  publisher: 'MeuExame',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://meuexame.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MeuExame - Plataforma de Estudos',
    description: 'Plataforma de estudos para preparação de exames e concursos',
    url: 'https://meuexame.vercel.app',
    siteName: 'MeuExame',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MeuExame',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeuExame - Plataforma de Estudos',
    description: 'Plataforma de estudos para preparação de exames e concursos',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}