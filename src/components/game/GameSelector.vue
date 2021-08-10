<template>
  <div class="game-selector">
    <autocomplete :items="gameList"
                  :initial-value="initialName"
                  @item-selected="selectGame($event)"
                  @item-changed="selectGame($event)" />
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';
import {Job} from '@/domain/types/Job';

@Component({components: {Autocomplete}})
export default class GameSelector extends Vue {

  @Prop({required: false, default: () => {}})
  private filter: (job: Job) => boolean

  @Prop({required: false, default: null})
  private initialValue: Job | null

  private mounted() {
    this.$store.dispatch('jobs/listen').then(() => {
      // TODO : add loading indication
    }).catch(() => {
      // TODO : show fatal error message
    });
    this.$store.dispatch('jobs/refresh').then(() => {
      // TODO : add loading indication
    }).catch(() => {
      // TODO : show fatal error message
    });
  }

  get initialName(): string {
    if (null != this.initialValue) {
      return this.jobLabel(this.initialValue)
    }
    return ''
  }

  get gameList(): string[] {
    let jobs = this.$store.getters['jobs/jobs'];
    return jobs
        .sort((a: Job, b: Job) => b.status.start - a.status.start)
        .filter(this.filter)
        .map(this.jobLabel);
  }

  @Emit('game-selected')
  private selectGame(label: string): Job | null {
    const jobs = this.$store.getters['jobs/jobs']
    for (const index in jobs) {
      if (this.jobLabel(jobs[index]) == label) {
        return jobs[index]
      }
    }
    return null
  }

  private jobLabel(job: Job): string {
    return `@${job.id} - ${job.name}`;
  }

}
</script>

<style scoped lang="scss">
</style>
