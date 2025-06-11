import React from 'react';
import { FileNode } from '../types/fileTypes';
export const DragOverlayContent: React.FC<{ node: FileNode }> = ({ node }) => (
    <div
        className="flex items-center gap-2 px-2 py-1 w-fit shadow-lg border border-neutral-200 dark:border-neutral-600 rounded-full text-[10px] text-black dark:text-white bg-neutral-200 dark:bg-neutral-600 opacity-50">
        <span>
            {node.name}
        </span>
    </div>
);
