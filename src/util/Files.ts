const k = 1024;
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export default class Files {

  public static formatBytes(bytes: number|null): string {
    // https://www.codexworld.com/how-to/convert-file-size-bytes-kb-mb-gb-javascript/
    if (null === bytes) {
      return '&mdash;';
    } else if (bytes === 0) {
      return '0 Bytes';
    } else {
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)).toLocaleString() + ' ' + sizes[i];
    }
  }

}
