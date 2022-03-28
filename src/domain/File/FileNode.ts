export interface FileNode {
  name: string;
  path: string;
  directory: boolean;
  children: FileNode[];
}
