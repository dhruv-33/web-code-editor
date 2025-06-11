'use client';

import React from 'react';
import { FileNode } from '../types/fileTypes';

interface FilePanelProps {
    file: FileNode | null;
}

const FilePanel: React.FC<FilePanelProps> = ({ file }) => {
    if (!file) {
        return (
            // when any file is not open
            <div className="flex-1 p-4 border border-black dark:border-white bg-gray-200 dark:bg-neutral-700 text-neutral-400 flex items-center justify-center">
                <span>No file open</span>
            </div>
        );
    }
};

export default FilePanel;


