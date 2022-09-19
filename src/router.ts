import Vue from 'vue';
import Router from 'vue-router';
import GameFormAlternative from '@/views/Game/GameForm.vue';
import GameTableView from '@/views/Game/GameTableView.vue';
import BrokersTable from '@/views/Broker/BrokersTable.vue';
import BrokerForm from '@/views/Broker/BrokerForm.vue';
import BaselineTable from '@/views/Baseline/BaselineTable.vue';
import BaselineDetails from '@/views/Baseline/BaselineDetails.vue';
import TreatmentEditor from '@/views/Treatment/TreatmentEditor.vue';
import GameView from '@/views/Game/Game.vue';
import TreatmentTable from '@/views/Treatment/TreatmentTable.vue';
import TreatmentView from '@/views/Treatment/TreatmentView.vue';
import BaselineEditorView from '@/views/Baseline/BaselineEditorView.vue';
import NewGameView from '@/views/Game/NewGameView.vue';
import GameConfigView from '@/views/Game/GameConfigView.vue';
import GameStorageView from '@/views/Game/GameStorageView.vue';
import StorageView from '@/views/System/StorageView.vue';
import UserTableView from "@/views/System/UserTableView.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/games',
    },
    {
      path: '/games',
      component: GameTableView,
    },
    {
      path: '/games/create',
      name: 'create-game',
      component: NewGameView,
    },
    {
      path: '/games/create/:id',
      name: 'create-game-template',
      component: GameFormAlternative,
    },
    {
      path: '/games/:gameId',
      name: 'game',
      redirect: (to) => ({name: 'game-config', params: {gameId: to.params.gameId}}),
    },
    {
      path: '/games/:id/details',
      redirect: '/games/:id/runs',
    },
    {
      path: '/games/:gameId/files',
      name: 'game-files',
      redirect: (to) => ({name: 'game-runs', params: {id: to.params.gameId}}),
    },
    {
      path: '/games/:id/runs',
      name: 'game-runs',
      component: GameView,
    },
    {
      path: '/games/:id/config',
      name: 'game-config',
      component: GameConfigView,
    },
    {
      path: '/games/:id/storage',
      name: 'game-storage',
      component: GameStorageView,
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
      component: BaselineEditorView,
    },
    {
      path: '/baselines/:id/details',
      component: BaselineDetails,
    },
    {
      path: '/baselines/:id/details/:gameId',
      component: BaselineDetails,
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
      component: TreatmentView,
    },
    {
      path: '/treatments/:id/games',
      component: TreatmentView,
    },
    {
      path: '/experimental/baseline-editor',
      component: BaselineEditorView,
    },
    {
      path: '/storage',
      component: StorageView,
    },
    {
      path: '/users',
      component: UserTableView,
    },
  ],
});
