"use client";

import { ApolloProvider } from '@apollo/client';
import client from './lib/apolloClient';
import { useEffect, useState } from 'react';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Menandakan render di klien
  }, []);

  if (!isClient) {
    return null; // Menghindari render di sisi server
  }

  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ApolloProvider>
  );
}
