import Vue from 'vue';
import Router from 'vue-router';
import GameFormAlternative from '@/views/Game/GameForm.vue';
import GameTable from '@/views/Game/GameTable.vue';
import GameSidebar from '@/views/Game/GameSidebar.vue';
import BrokersTable from '@/views/Broker/BrokersTable.vue';
import BrokerForm from '@/views/Broker/BrokerForm.vue';
import BaselineTable from '@/views/Baseline/BaselineTable.vue';
import BaselineForm from '@/views/Baseline/BaselineForm.vue';
import BaselineDetails from '@/views/Baseline/BaselineDetails.vue';
import TreatmentEditor from '@/views/Treatment/TreatmentEditor.vue';
import GameView from '@/views/Game/GameView.vue';
import TreatmentTable from '@/views/Treatment/TreatmentTable.vue';
import TreatmentView from '@/views/Treatment/TreatmentView.vue';
import BaselineEditorView from '@/views/Baseline/BaselineEditorView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/games',
    },
    {
      path: '/games',
      component: GameTable,
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
      path: '/games/:gameId',
      name: 'game',
      components: {
        default: GameTable,
        sidebar: GameSidebar,
      },
    },
    {
      path: '/games/:id/details',
      redirect: '/games/:id/runs',
    },
    {
      path: '/games/:id/runs',
      name: 'game-details',
      component: GameView,
    },
    {
      path: '/brokers',
      component: BrokersTable,
    },
    {
      path: '/brokers/create',
      component: BrokerForm,
    },
    {
      path: '/baselines',
      component: BaselineTable,
    },
    {
      path: '/baselines/create',
      component: BaselineForm,
    },
    {
      path: '/baselines/:id/details',
      component: BaselineDetails,
    },
    {
      path: '/baselines/:id/details/:gameId',
      components: {
        default: BaselineDetails,
        sidebar: GameSidebar,
      },
    },
    {
      path: '/treatments/editor',
      component: TreatmentEditor,
    },
    {
      path: '/treatments/',
      component: TreatmentTable,
    },
    {
      path: '/treatments/:id/games/:gameId',
      components: {
        default: TreatmentView,
        sidebar: GameSidebar,
      },
    },
    {
      path: '/treatments/:id/games',
      component: TreatmentView,
    },
    {
      path: '/experimental/baseline-editor',
      component: BaselineEditorView,
    },
  ],
});
