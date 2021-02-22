<template>
  <div id="messages">
    <h2>Messages</h2>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class ApplicationMessages extends Vue {}
</script>

<style lang="scss">
#messages {
  background: #fff;
  min-width: 20rem;
}
</style>
