'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppStateProvider } from '@/utils/context';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  pageProps,
}: Readonly<{
  children: React.ReactNode;
  pageProps: any;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang='en'>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider {...pageProps}>{children}</AppStateProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
