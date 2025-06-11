'use client';

import { ReactNode } from 'react';
import { TerminalProvider } from './features/terminal-run';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system">
            <TerminalProvider>
                {children}
            </TerminalProvider>
        </ThemeProvider>
    )
}