<template>
  <div class="action-bar">
    <button type="button" @click="back">
      <fa-icon icon="arrow-left" class="icon-left" />
      Back
    </button>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {RawLocation} from 'vue-router';

@Component
export default class ViewActionBar extends Vue {

  @Prop({required: false, default: () => null})
  private backRoute: RawLocation|null;

  private back(): void {
    if (null == this.backRoute) {
      this.$router.back();
    } else {
      this.$router.push(this.backRoute)
    }
  }

}
</script>
