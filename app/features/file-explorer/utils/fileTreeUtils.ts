import { FileNode } from "../types/fileTypes";

export const saveToLocalStorage = (data: FileNode[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('fileTree', JSON.stringify(data));
    }
};

export const loadFromLocalStorage = (): FileNode[] => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('fileTree');
        return data ? JSON.parse(data) : [];
    }
    return [];
};