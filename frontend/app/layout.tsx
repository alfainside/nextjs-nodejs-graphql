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
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
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
