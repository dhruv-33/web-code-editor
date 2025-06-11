'use client';

import React, { useEffect, useState } from 'react';
import { FileNode } from '../types/fileTypes';
import { FileNode as FileNodeComponent } from './FileNode';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/fileTreeUtils';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { DragOverlayContent } from './DragOverlayContent';

interface ExplorerProps {
    onFileClick: (file: FileNode) => void;
    onDelete: (fileId: string) => void;
    onFileRename?: (id: string, newName: string) => void;
}

const Explorer: React.FC<ExplorerProps> = ({ onFileClick, onDelete, onFileRename }) => {
    const [tree, setTree] = useState<FileNode[]>([]);
    const [activeNode, setActiveNode] = useState<FileNode | null>(null);
    const [filter, setFilter] = useState('');

    useEffect(() => setTree(loadFromLocalStorage()), []);
    useEffect(() => saveToLocalStorage(tree), [tree]);

    // Add root node
    const addRootFolder = () => {
        const base = 'New Folder';
        const existing = tree.map(n => n.name.toLowerCase());
        let name = base;
        let idx = 1;
        while (existing.includes(name.toLowerCase())) {
            name = `${base} ${idx++}`;
        }
        setTree(prev => [
            ...prev,
            { id: uuidv4(), name, type: 'folder', children: [] },
        ]);
    };

    // update node
    const updateNode = (updated: FileNode) => {
        const recurse = (nodes: FileNode[]): FileNode[] =>
            nodes.map(n =>
                n.id === updated.id
                    ? updated
                    : { ...n, children: n.children ? recurse(n.children) : undefined }
            );
        setTree(recurse(tree));
    };

    // delete
    const deleteNode = (id: string) => {
        const recurse = (nodes: FileNode[]): FileNode[] =>
            nodes
                .filter(n => n.id !== id)
                .map(n => ({
                    ...n,
                    children: n.children ? recurse(n.children) : undefined
                }));
        setTree(recurse(tree));
        onDelete(id);
    };

    // move node
    const moveNode = (draggedId: string, targetId: string) => {
        let dragged: FileNode | null = null;
        const remove = (nodes: FileNode[]): FileNode[] =>
            nodes.reduce((acc, n) => {
                if (n.id === draggedId) {
                    dragged = n;
                    return acc;
                }
                return [...acc, { ...n, children: n.children ? remove(n.children) : undefined }];
            }, [] as FileNode[]);

        const insert = (nodes: FileNode[]): FileNode[] =>
            nodes.map(n =>
                n.id === targetId && n.type === 'folder'
                    ? { ...n, children: [...(n.children || []), dragged!] }
                    : { ...n, children: n.children ? insert(n.children) : undefined }
            );

        const noDragged = remove(tree);
        setTree(insert(noDragged));
    };

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (active.id && over?.id && active.id !== over.id && activeNode) {
            if (confirm(`Move '${activeNode.name}'?`)) {
                moveNode(active.id.toString(), over.id.toString());
            }
        }
    };

    // Recursive filtering
    const filterTree = (nodes: FileNode[]): FileNode[] => {
        return nodes
            .map(node => {
                const isMatch = node.name.toLowerCase().includes(filter.toLowerCase());
                const children = node.children ? filterTree(node.children) : [];

                if (isMatch || children.length > 0) {
                    return {
                        ...node,
                        children: children.length > 0 ? children : undefined,
                        highlight: isMatch,
                    };
                }
                return null;
            })
            .filter(Boolean) as FileNode[];
    };

    // Sort files/folders with names alphabetically
    const sortTree = (nodes: FileNode[]): FileNode[] => {
        return nodes
            .sort((a, b) => {
                if (a.type === 'folder' && b.type !== 'folder') return -1;
                if (a.type !== 'folder' && b.type === 'folder') return 1;
                return a.name.localeCompare(b.name);
            })
            .map(node => ({
                ...node,
                children: node.children ? sortTree(node.children) : undefined,
            }));
    };

    // Helper: Get all parent folder IDs for any matching file/folder
    const getExpandedFolderIds = (nodes: FileNode[], filter: string, parents: string[] = []): string[] => {
        let expanded: string[] = [];
        for (const node of nodes) {
            const isMatch = node.name.toLowerCase().includes(filter.toLowerCase());
            let childExpanded: string[] = [];
            if (node.children) {
                childExpanded = getExpandedFolderIds(node.children, filter, [...parents, node.id]);
            }
            // If any child matched, add this folder's id
            if (childExpanded.length > 0) {
                expanded.push(node.id);
            }
            // If this node is a match, add all its parent folders
            if (isMatch) {
                expanded = expanded.concat(parents);
            }
            expanded = expanded.concat(childExpanded);
        }
        // Remove duplicates
        return Array.from(new Set(expanded));
    };

    const sortedTree = sortTree(filter ? filterTree(tree) : tree);
    const expandedFolderIds = filter ? getExpandedFolderIds(tree, filter) : [];

    return (
        <DndContext
            sensors={useSensors(useSensor(PointerSensor))}
            onDragStart={({ active }) => {
                const findNode = (nodes: FileNode[]): FileNode | null => {
                    for (const n of nodes) {
                        if (n.id === active.id) return n;
                        if (n.children) {
                            const found = findNode(n.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                setActiveNode(findNode(tree));
            }}
            onDragEnd={handleDragEnd}
        >
            <div className="w-full h-full p-4 pl-2 border border-black bg-neutral-300 text-black dark:border-white dark:bg-neutral-800 dark:text-white">
                {/* Search Tab */}
                <input
                    title='Search Files/Folders'
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="Search files/folders..."
                    className="mb-2 w-full px-2 py-1 border border-gray-400 bg-white text-black dark:bg-neutral-800 dark:text-white rounded"
                />

                {/* Root Folder */}
                <button
                    title='Create New Root Folder'
                    onClick={addRootFolder}
                    className="mb-4 px-3 py-1 rounded bg-neutral-800 dark:bg-neutral-300 text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-200"
                >
                    + Root Folder
                </button>

                {sortedTree.length === 0 && (
                    <div className="mt-10 text-center text-neutral-500 dark:text-neutral-500 italic">
                        No files or folders found.
                    </div>
                )}

                {sortedTree.map(node => (
                    <FileNodeComponent
                        key={node.id}
                        node={node}
                        onUpdate={updateNode}
                        onDelete={deleteNode}
                        onMove={moveNode}
                        onFileClick={onFileClick}
                        siblingNames={tree
                            .filter(n => n.id !== node.id)
                            .map(n => n.name.toLowerCase())}
                        onFileRename={onFileRename}
                        forceExpandIds={expandedFolderIds}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeNode && <DragOverlayContent node={activeNode} />}
            </DragOverlay>
        </DndContext>
    );
};

export default Explorer;
