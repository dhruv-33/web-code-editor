'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import type { FileNode as FileNodeType } from '../types/fileTypes';
import { ChevronDown, ChevronRight, Edit2, Trash2, PlusCircle, Folder, File as FileIcon, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface FileNodeProps {
    node: FileNodeType;
    onUpdate: (updatedNode: FileNodeType) => void;
    onDelete: (id: string) => void;
    onMove: (draggedId: string, targetId: string) => void;
    siblingNames?: string[];
    autoEdit?: boolean;
    onFileClick?: (node: FileNodeType) => void;
    onFileRename?: (id: string, newName: string) => void;
    forceExpandIds?: string[];
}

export const FileNode: React.FC<FileNodeProps> = ({
    node,
    onUpdate,
    onDelete,
    onMove,
    siblingNames = [],
    autoEdit,
    onFileClick,
    onFileRename,
    forceExpandIds = [],
}) => {
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(autoEdit || false);
    const [newName, setNewName] = useState(node.name);
    const inputRef = useRef<HTMLInputElement>(null);

    const { setNodeRef: dragRef, attributes, listeners } = useDraggable({
        id: node.id,
        data: { node },
    });
    const { setNodeRef: dropRef, isOver } = useDroppable({ id: node.id });

    // Autofocus input when editing
    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    // Auto-expand/collapse if forceExpandIds is set (i.e., during search)
    useEffect(() => {
        if (forceExpandIds.length > 0) {
            setExpanded(forceExpandIds.includes(node.id));
        }
    }, [forceExpandIds, node.id]);

    // Rename
    const handleRename = () => {
        const trimmed = newName.trim();
        if (!trimmed) {
            setNewName(node.name);
            setEditing(false);
            return;
        }
        if (siblingNames.includes(trimmed.toLowerCase())) {
            alert(`A file or folder named “${trimmed}” already exists here.`);
            setNewName(node.name);
            return;
        }
        onUpdate({ ...node, name: trimmed });
        if (onFileRename && trimmed !== node.name) {
            onFileRename(node.id, trimmed);
        }
        setEditing(false);
    };

    // Cancel Rename
    const handleCancel = () => {
        setNewName(node.name);
        setEditing(false);
    };

    // Add file/folder
    const addChild = (type: 'file' | 'folder') => {
        const base = type === 'file' ? 'New File' : 'New Folder';
        const existing = node.children?.map(c => c.name.toLowerCase()) || [];
        let name = base;
        let idx = 1;
        while (existing.includes(name.toLowerCase())) {
            name = `${base} ${idx++}`;
        }
        const newChild: FileNodeType = {
            id: uuidv4(),
            name,
            type,
            children: type === 'folder' ? [] : undefined,
        };
        onUpdate({
            ...node,
            children: [...(node.children || []), newChild],
        });
        setExpanded(true);
    };

    // Delete confirmation
    const confirmDelete = () => {
        if (confirm(`Delete "${node.name}"?`)) {
            // First trigger the delete to close any open tabs
            onDelete(node.id);

            // Then remove the file content from localStorage
            const removeStoredContent = (n: FileNodeType) => {
                if (n.type === 'file') {
                    localStorage.removeItem(`fileContent-${n.id}`);
                } else if (n.type === 'folder' && Array.isArray(n.children)) {
                    n.children.forEach(removeStoredContent);
                }
            };

            removeStoredContent(node);
        }
    };

    // Handle drop events
    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const draggedNode = event.dataTransfer.getData('application/json');
        const parsedNode = JSON.parse(draggedNode);

        if (node.type === 'file') {
            alert('Cannot drop here. End location is a file.');
            return;
        }

        // Handle valid drop logic
        onMove(parsedNode.id, node.id);
    };

    return (
        <div
            ref={dropRef}
            onDrop={handleDrop}
            className={`pl-2 py-1 rounded-sm transition-colors duration-150 ${isOver ? 'bg-neutral-200 dark:bg-neutral-700' : ''
                }`}
        >
            <div className="flex items-center gap-1 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700">
                {node.type === 'folder' ? (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-neutral-900 dark:text-white cursor-pointer"
                    >
                        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                ) : (
                    <div>
                        <FileIcon size={14} className="text-black dark:text-white" />
                    </div>
                )}

                {editing ? (
                    <input
                        ref={inputRef}
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={e => {
                            if (e.key === 'Enter') handleRename();
                            if (e.key === 'Escape') handleCancel();
                        }}
                        className="border-b border-neutral-800 dark:border-neutral-300 px-1 w-20 text-sm text-black dark:text-white"
                    />
                ) : (
                    <span
                        onClick={() => {
                            if (node.type === 'file') {
                                onFileClick?.(node);
                            } else {
                                setExpanded(!expanded);
                            }
                        }}
                        className={`cursor-pointer w-full truncate text-black dark:text-white ${node.highlight ? 'bg-yellow-200 dark:bg-yellow-400 rounded px-1' : ''}`}
                    >
                        {node.name}
                    </span>
                )}

                {node.type === 'folder' && (
                    <>
                        {/* Add file */}
                        <button onClick={() => addChild('file')} title="New File">
                            <PlusCircle size={14} className="text-blue-500 cursor-pointer" />
                        </button>

                        {/* Add folder */}
                        <button onClick={() => addChild('folder')} title="New Folder">
                            <Folder size={14} className="text-yellow-500 cursor-pointer" />
                        </button>
                    </>
                )}

                {/* Rename file/folder */}
                <button onClick={() => setEditing(true)} title="Rename">
                    <Edit2 size={14} className="text-green-500 cursor-pointer" />
                </button>

                {/* Delete file/folder */}
                <button onClick={confirmDelete} title="Delete">
                    <Trash2 size={14} className="text-red-500 cursor-pointer" />
                </button>

                {/* Drag & Drop */}
                <span
                    ref={dragRef}
                    {...attributes}
                    {...listeners}
                    className=" cursor-grab active:cursor-grabbing"
                    title="Drag"
                >
                    <GripVertical size={14} className="text-black dark:text-white" />
                </span>
            </div>

            {/* Expand folder */}
            {expanded &&
                node.children?.map(child => (
                    <FileNode
                        key={child.id}
                        node={child}
                        siblingNames={node.children!
                            .filter(c => c.id !== child.id)
                            .map(c => c.name.toLowerCase())}
                        onUpdate={updatedChild => {
                            const updated = node.children!.map(c =>
                                c.id === updatedChild.id ? updatedChild : c
                            );
                            onUpdate({ ...node, children: updated });
                        }}
                        onDelete={childId => {
                            const filtered = node.children!.filter(c => c.id !== childId);
                            onUpdate({ ...node, children: filtered });
                        }}
                        onMove={onMove}
                        autoEdit={false}
                        onFileClick={onFileClick}
                        onFileRename={onFileRename}
                        forceExpandIds={forceExpandIds}
                    />
                ))}
        </div>
    );
};

export default FileNode;
