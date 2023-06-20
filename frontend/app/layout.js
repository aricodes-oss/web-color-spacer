'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Inter } from 'next/font/google';
import SSRProvider from 'react-bootstrap/SSRProvider';

const queryClient = new QueryClient();

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SSRProvider>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </SSRProvider>
      </body>
    </html>
  );
}
