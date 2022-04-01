<template>
    <span class="duration" v-html="durationString"></span>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import moment from 'moment';

@Component({name: 'duration'})
export default class Duration extends Vue {

  @Prop({required: true})
  private start: number;

  @Prop({required: true})
  private end: number;

  @Prop({required: false, default: () => false })
  private shouldTick: boolean;

  get now(): number {
    return this.$store.getters.time;
  }

  get realEnd(): number {
    return this.end >= 0 || !this.shouldTick ? this.end : this.now;
  }

  get duration(): moment.Duration {
    return moment.duration(moment(this.realEnd).diff(moment(this.start)));
  }

  get durationString(): string {
    if (this.realEnd < 0 || !this.duration.isValid()) {
      return '&mdash;';
    } else {
      return this.duration.hours().toString().padStart(2, "0") + ":"
          + this.duration.minutes().toString().padStart(2, "0") + ":"
          + this.duration.seconds().toString().padStart(2, "0");
    }
  }

}
</script>
