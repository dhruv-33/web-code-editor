'use client';
import React, { createContext, useContext, useState } from 'react';

interface TerminalContextValue {
    output: string[];
    setOutput: (lines: string[]) => void;
}

const TerminalContext = createContext<TerminalContextValue>({
    output: [],
    setOutput: () => { },
});

export const TerminalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [output, setOutput] = useState<string[]>([]);

    return (
        <TerminalContext.Provider value={{ output, setOutput }}>
            {children}
        </TerminalContext.Provider>
    );
};

export const useTerminal = () => useContext(TerminalContext);