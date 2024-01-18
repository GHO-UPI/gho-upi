import './globals.css';
import { Provider } from '@/components/provider';

import { Metadata } from 'next'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: {
    default: 'Ghost NFT Protocol',
    template: `%s - Next.js AI Chatbot`
  },
  description: 'Mint GHO Tokens by submitting NFTs as collateral',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          'font-sans antialiased overflow-hidden',
        )}
      >
        <Provider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}

export default RootLayout;
