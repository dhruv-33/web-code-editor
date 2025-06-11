'use client';
import React from 'react';
import { X } from 'lucide-react';
import { FileNode } from '../../file-explorer/types/fileTypes';

interface FileTabsProps {
    tabs: FileNode[];
    activeTabId: string | null;
    dirtyTabs: Record<string, boolean>;
    onTabClick: (id: string) => void;
    onClose: (id: string) => void;
}

const FileTabs: React.FC<FileTabsProps> = ({ tabs, activeTabId, dirtyTabs, onTabClick, onClose }) => (
    <div className="flex overflow-x-auto bg-neutral-300 dark:bg-neutral-800">
        {tabs.map(tab => {
            const isActive = tab.id === activeTabId;
            const isDirty = !!dirtyTabs[tab.id];
            return (
                <div
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={
                        `flex items-center h-9 px-3 py-1 cursor-pointer whitespace-nowrap select-none text-black dark:text-white border-r-1 border-black dark:border-white ` +
                        (isActive
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-black border-t-3 border-t-blue-500 dark:border-t-blue-500'
                            : 'hover:bg-neutral-200 dark:hover:bg-neutral-700 text-black dark:text-white')
                    }
                >
                    {/* Unsaved changes indicator */}
                    <span className="truncate max-w-xs">
                        {tab.name}{isDirty ? '*' : ''}
                    </span>

                    {/* Close button for Tab */}
                    <button title='Close'>
                    <X
                        onClick={e => { e.stopPropagation(); onClose(tab.id); }}
                        className="ml-2 w-4 h-4 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-600"
                    />
                    </button>
                </div>
            );
        })}
    </div>
);

export default FileTabs;
