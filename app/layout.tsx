import './globals.css';
import { ReactNode } from 'react';
import { Providers } from './Providers';

export const metadata = {
  title: 'VS Code - style web code editor',
  description: 'Web-Based VS Code - Like Code Editor',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Wrap only in the client‐side Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
