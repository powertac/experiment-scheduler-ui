<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AuthenticatedNavigation from "@/components/application/AuthenticatedNavigation.vue";
import ApplicationBar from "@/components/application/ApplicationBar.vue";

@Component({components: {'app-nav': AuthenticatedNavigation, 'app-bar': ApplicationBar}})
export default class PublicView extends Vue {


}
</script>

<template>
  <div id="main">
    <router-view id="view" />
    <!--<app-bar id="bottom-bar" />-->
  </div>
</template>

<style lang="scss">
</style>
