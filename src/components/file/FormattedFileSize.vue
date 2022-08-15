<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class FormattedFileSize extends Vue {

  @Prop({required: true})
  private bytes: number|null;

  get formattedSize(): string {
    // https://www.codexworld.com/how-to/convert-file-size-bytes-kb-mb-gb-javascript/
    if (null === this.bytes) {
      return '&mdash;';
    } else if(this.bytes == 0) {
      return '0 Bytes';
    } else {
      const k = 1024,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(this.bytes) / Math.log(k));
      return parseFloat((this.bytes / Math.pow(k, i)).toFixed(2)).toLocaleString() + ' ' + sizes[i];
    }
  }

}
</script>

<template>
  <span v-html="formattedSize"></span>
</template>
