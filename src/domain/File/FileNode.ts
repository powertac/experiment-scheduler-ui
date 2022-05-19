export default interface FileNode {
  name: string;
  path: string;
  directory: boolean;
  children: FileNode[];
}
