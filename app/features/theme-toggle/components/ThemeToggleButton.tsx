'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const ThemeToggleButton: React.FC = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!mounted) return null;

    const getIcon = () => {
        if (theme === 'system') return '🖥️';
        return resolvedTheme === 'dark' ? '🌙' : '☀️';
    };

    return (
        <div className="absolute left-0 bottom-0 ml-5 mb-5" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className="h-11 w-11 rounded-full cursor-pointer border-2 border-black bg-white text-black dark:bg-neutral-700 dark:text-white hover:bg-gray-300 dark:hover:bg-neutral-600"
                title="Select Theme"
            >
                {getIcon()}
            </button>

            {open && (
                <div className="mt-2 rounded shadow bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 bottom-12 absolute w-[115px]">
                    <button
                        onClick={() => {
                            setTheme('light');
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                        ☀️ Light
                    </button>
                    <button
                        onClick={() => {
                            setTheme('dark');
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                        🌙 Dark
                    </button>
                    <button
                        onClick={() => {
                            setTheme('system');
                            setOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                        🖥️ System
                    </button>
                </div>
            )}
        </div>
    );
};

export default ThemeToggleButton;
