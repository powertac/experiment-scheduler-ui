import Vue from 'vue';
import Router from 'vue-router';
import JobForm from '@/views/Game/GameForm.vue';
import GameTable from "@/views/Game/GameTable.vue";
import GameSidebar from "@/views/Game/GameSidebar.vue";
import GameFormAlternative from "@/views/Game/GameFormAlternative.vue";
import ExperimentFormAlternative from "@/views/Experiment/ExperimentFormAlternative.vue";
import ExperimentsTable from "@/views/Experiment/ExperimentsTable.vue";
import ExperimentSidebar from "@/views/Experiment/ExperimentSidebar.vue";
import GameDetails from "@/views/Game/GameDetails.vue";
import ExperimentDetails from "@/views/Experiment/ExperimentDetails.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/experiments',
    },
    {
      path: '/games',
      component: GameTable
    },
    {
      path: '/games/create',
      name: 'create-game',
      component: GameFormAlternative,
    },
    {
      path: '/games/:id',
      name: 'game',
      components: {
        default: GameTable,
        sidebar: GameSidebar
      }
    },
    {
      path: '/jobs/create',
      name: 'jobForm',
      component: JobForm,
    },
    {
      path: '/games/:id/details',
      name: 'game-details',
      component: GameDetails,
    },
    {
      path: '/experiments',
      name: 'experiments',
      component: ExperimentsTable,
    },
    {
      path: '/experiments/create',
      name: 'experiment-create',
      component: ExperimentFormAlternative,
    },
    {
      path: '/experiments/:id',
      name: 'experiment',
      components: {
        default: ExperimentsTable,
        sidebar: ExperimentSidebar
      }
    },
    {
      path: '/experiments/:hash/details',
      name: 'experimentDetails',
      component: ExperimentDetails
    },
  ],
});
