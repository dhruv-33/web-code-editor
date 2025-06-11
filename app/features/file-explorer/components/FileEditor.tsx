'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { FileNode } from '../types/fileTypes';
import { useTerminal } from '../../terminal-run/hooks/useTerminal';
import { useTheme } from 'next-themes';
import { Play } from 'lucide-react';

const MonacoEditor = dynamic(
    () => import('@monaco-editor/react').then(mod => mod.default),
    { ssr: false }
);

interface FileEditorProps {
    file: FileNode;
    onDirtyChange: (id: string, dirty: boolean) => void;
    showTerminal: () => void;
}

const detectLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop();
    switch (ext) {
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'js':
            return 'javascript';
        default:
            return 'plaintext';
    }
};

const FileEditor: React.FC<FileEditorProps> = ({ file, onDirtyChange, showTerminal }) => {
    const storageKey = `fileContent-${file.id}`;
    const [content, setContent] = useState<string>('');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { setOutput } = useTerminal();
    const { resolvedTheme } = useTheme();
    const runRef = useRef<() => void>(() => { });

    // update when content changes
    useEffect(() => {
        runRef.current = handleRun;
    }, [content]);

    // Load saved content
    useEffect(() => {
        setContent(localStorage.getItem(storageKey) || '');
        onDirtyChange(file.id, false);
    }, [storageKey]);

    // Debounce auto-save 1s after user stops typing
    useEffect(() => {
        // mark unsaved changes
        onDirtyChange(file.id, true);

        // reset any existing timer
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            handleSave();
        }, 1000);
        return () => { if (timer.current) clearTimeout(timer.current); };
    }, [content, file.id]);

    // save content to localStorage
    const handleSave = () => {
        localStorage.setItem(storageKey, content);
        onDirtyChange(file.id, false);
    }

    // Run handler inside this editor
    const handleRun = () => {
        const ext = file.name.split('.').pop();
        if (ext !== 'js') {
            setOutput([`⛔ Cannot run "${file.name}": only run '.js' files`]);
            showTerminal();
            return;
        }
        const logs: string[] = [];
        const sandboxConsole = { log: (...args: unknown[]) => logs.push(args.join(' ')) };
        try {
            new Function('console', content)(sandboxConsole);
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'message' in err) {
                logs.push(`❌ Error: ${(err as { message: string }).message}`);
            } else {
                logs.push('❌ Error: Unknown error');
            }
        }
        setOutput(logs);
        showTerminal();
    };

    return (
        <div className="flex-1 flex flex-col border border-black dark:border-white bg-neutral-200 dark:bg-neutral-700">
            <div className="flex-1">
                {/* Integrate Monaco Editor */}
                <MonacoEditor
                    key={resolvedTheme}
                    height="100%"
                    language={detectLanguage(file.name)}
                    value={content}
                    theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                    onChange={v => setContent(v ?? '')}
                    options={{
                        minimap: { enabled: false },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                    }}
                    onMount={(editor, monaco) => {
                        // Ctrl+S or Cmd+S for Save
                        editor.addCommand(
                            monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                            () => {
                                if (timer.current) clearTimeout(timer.current);
                                handleSave();
                            }
                        );

                        // Ctrl+Enter or Cmd+Enter for Run
                        editor.addCommand(
                            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                            () => {
                                runRef.current();
                            }
                        );
                    }}
                />
            </div>
            <div>
                {/* Save Button */}
                <button
                    title="Save (Ctrl+S)"
                    onClick={() => {
                        if (timer.current) clearTimeout(timer.current);
                        localStorage.setItem(storageKey, content);
                        onDirtyChange(file.id, false);
                    }}
                    className="pl-3 pr-3 h-fit cursor-pointer bg-blue-500 hover:bg-blue-600 top-1.5 right-12 absolute text-black dark:text-white rounded"
                >
                    Save
                </button>
                {/* Run Button */}
                <button
                    title="Ctrl+Enter"
                    onClick={handleRun}
                    className="p-1 pb-0 self-center cursor-pointer hover:opacity-80 right-1 top-0 absolute text-black dark:text-white"
                >
                    <Play size={30} className='pl-1 self-center' />
                </button>
            </div>
        </div>
    );
};

export default FileEditor;