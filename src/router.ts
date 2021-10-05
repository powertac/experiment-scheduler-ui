import Vue from 'vue';
import Router from 'vue-router';
import GameFormAlternative from '@/views/Game/GameForm.vue';
import GameTable from '@/views/Game/GameTable.vue';
import GameSidebar from '@/views/Game/GameSidebar.vue';
import GameDetails from '@/views/Game/GameDetails.vue';
import BrokersTable from '@/views/Broker/BrokersTable.vue';
import BrokerForm from '@/views/Broker/BrokerForm.vue';

Vue.use(Router);

export default new Router({
  routes: [
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
      path: '/games/:id',
      name: 'game',
      components: {
        default: GameTable,
        sidebar: GameSidebar,
      },
    },
    {
      path: '/games/:id/details',
      name: 'game-details',
      component: GameDetails,
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
