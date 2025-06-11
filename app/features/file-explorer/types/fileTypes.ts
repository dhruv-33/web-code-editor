export type FileNode = {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    highlight?: boolean;
};