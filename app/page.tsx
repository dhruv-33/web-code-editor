'use client';
import React, { useState, useEffect, useRef } from 'react';
import { TerminalProvider, useTerminal } from './features/terminal-run/hooks/useTerminal';
import Explorer from './features/file-explorer/components/Explorer';
import FileTabs from './features/file-explorer/components/FileTabs';
import FilePanel from './features/file-explorer/components/FilePanel';
import FileEditor from './features/file-explorer/components/FileEditor';
import { FileNode } from './features/file-explorer/types/fileTypes';
import { ThemeToggleButton } from './features/theme-toggle';
import { X } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

function Terminal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { output } = useTerminal();
    if (!visible) return null;

    return (
        <div className="w-full h-full bg-neutral-300 dark:bg-neutral-800 text-black dark:text-white relative border">
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-300 dark:bg-neutral-800 border-b sticky top-0 z-10">
                <span className='text-2xl'>
                    Terminal
                </span>
                <X className="p-1 top-2 right-1 absolute cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded" size={30} onClick={onClose} />
            </div>
            <div className="pl-2 px-4 py-3 text-base leading-relaxed select-text overflow-auto h-[calc(100%-56px)]">
                {output.length === 0
                    ? <div>No output</div>
                    : output.map((line, i) => <div key={i}>{line}</div>)}
            </div>
        </div>
    );
}

export default function HomePage() {
    const [openTabs, setOpenTabs] = useState<FileNode[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [dirtyTabs, setDirtyTabs] = useState<Record<string, boolean>>({});
    const [showTerminal, setShowTerminal] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                setShowTerminal(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleFileClick = (file: FileNode) => {
        setOpenTabs(prev => (prev.some(f => f.id === file.id) ? prev : [...prev, file]));
        setActiveFileId(file.id);
    };

    const handleCloseTab = (id: string) => {
        setOpenTabs(prev => prev.filter(t => t.id !== id));
        if (id === activeFileId) {
            const remaining = openTabs.filter(t => t.id !== id);
            setActiveFileId(remaining.length ? remaining[0].id : null);
        }
    };

    const handleDirtyChange = (id: string, dirty: boolean) => {
        setDirtyTabs(prev => ({ ...prev, [id]: dirty }));
    };

    const handleFileDelete = (fileId: string) => {
        const fileTab = openTabs.find(tab => tab.id === fileId);
        if (fileTab) {
            handleCloseTab(fileId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [fileId]: _, ...remainingDirty } = dirtyTabs;
            setDirtyTabs(remainingDirty);
        }
    };

    const handleFileRename = (id: string, newName: string) => {
        setOpenTabs(prevTabs => prevTabs.map(tab =>
            tab.id === id ? { ...tab, name: newName } : tab
        ));
    };

    const activeFile = openTabs.find(t => t.id === activeFileId) || null;

    return (
        <TerminalProvider>
            <div className="h-screen w-screen bg-neutral-300 dark:bg-neutral-800 text-black dark:text-white">
                <PanelGroup direction="horizontal" className="h-full" autoSaveId="main-layout">
                    {/* Explorer Panel */}
                    <Panel defaultSize={15} minSize={15}>
                        <Explorer onFileClick={handleFileClick} onDelete={handleFileDelete} onFileRename={handleFileRename} />
                    </Panel>

                    <PanelResizeHandle className="w-0.5 bg-gray-400 hover:bg-blue-500 hover:border-blue-500 hover:border-2 cursor-col-resize" />

                    <Panel defaultSize={80} minSize={30}>
                        <PanelGroup direction="vertical">
                            <Panel defaultSize={70}>
                                <div className="flex flex-col h-full relative" ref={editorRef}>
                                    {/* Tabs */}
                                    {activeFile ? (
                                        <div className="h-9 border-1 border-b-0">
                                            <FileTabs
                                                tabs={openTabs}
                                                activeTabId={activeFileId}
                                                dirtyTabs={dirtyTabs}
                                                onTabClick={setActiveFileId}
                                                onClose={handleCloseTab}
                                            />
                                        </div>
                                    ) : (
                                        <div className="hidden" />
                                    )}

                                    {/* Editor */}
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        {activeFile ? (
                                            <FileEditor
                                                file={activeFile}
                                                onDirtyChange={handleDirtyChange}
                                                showTerminal={() => setShowTerminal(true)}
                                            />
                                        ) : (
                                            <FilePanel file={null} />
                                        )}
                                    </div>
                                </div>
                            </Panel>

                            {/* Terminal Toggle */}
                            {showTerminal && (
                                <PanelResizeHandle className="h-0.5 bg-gray-400 hover:bg-blue-500 hover:border-blue-500 hover:border-2 cursor-row-resize" />
                            )}

                            {/* Terminal Panel */}
                            {showTerminal && (
                                <Panel defaultSize={40} minSize={40}>
                                    <Terminal visible={showTerminal} onClose={() => setShowTerminal(false)} />
                                </Panel>
                            )}
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
                <ThemeToggleButton />
            </div >
        </TerminalProvider >
    );
}