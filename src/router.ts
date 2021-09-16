import Vue from 'vue';
import Router from 'vue-router';
import GameFormAlternative from '@/views/Game/GameForm.vue';
import ExperimentFormAlternative from '@/views/Experiment/ExperimentFormAlternative.vue';
import ExperimentsTable from '@/views/Experiment/ExperimentsTable.vue';
import ExperimentSidebar from '@/views/Experiment/ExperimentSidebar.vue';
import ExperimentDetails from '@/views/Experiment/ExperimentDetails.vue';
import BaselineTable from '@/views/Baseline/BaselineTable.vue';
import BaselineForm from '@/views/Baseline/BaselineForm.vue';
import NewGameTable from '@/views/Game/NewGameTable.vue';
import NewGameSidebar from '@/views/Game/NewGameSidebar.vue';
import NewGameDetails from '@/views/Game/NewGameDetails.vue';
import BrokersTable from '@/views/Broker/BrokersTable.vue';
import BrokerForm from '@/views/Broker/BrokerForm.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/experiments',
    },
    {
      path: '/games',
      component: NewGameTable,
    },
    {
      path: '/games/create',
      name: 'create-game',
      component: GameFormAlternative,
    },
    {
      path: '/games/create/:id',
      name: 'create-game-template',
      component: GameFormAlternative,
    },
    {
      path: '/games/:id',
      name: 'game',
      components: {
        default: NewGameTable,
        sidebar: NewGameSidebar,
      },
    },
    {
      path: '/games/:id/details',
      name: 'game-details',
      component: NewGameDetails,
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
        sidebar: ExperimentSidebar,
      },
    },
    {
      path: '/experiments/:hash/details',
      name: 'experimentDetails',
      component: ExperimentDetails,
    },
    {
      path: '/baselines/',
      component: BaselineTable,
    },
    {
      path: '/baselines/create',
      component: BaselineForm,
    },
    {
      path: '/brokers',
      component: BrokersTable,
    },
    {
      path: '/brokers/create',
      component: BrokerForm,
    },
  ],
});
