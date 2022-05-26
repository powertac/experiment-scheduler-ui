<template>
  <span v-html="formattedDate"></span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import moment from 'moment';

@Component({name: 'formatted-date'})
export default class FormattedDate extends Vue {

  @Prop({required: true})
  private date: number|null;

  get formattedDate():string {
    return (null === this.date || -1 === this.date)
        ? '&mdash;'
        : moment(this.date).format('L HH:mm');
  }

}
</script>

