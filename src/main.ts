// vue
import Vue from 'vue';
import Vuex from 'vuex';
import {VueAdapter} from '@/VueAdapter';
import App from './Application.vue';
import router from './router';
import rootStore from './domain/Store/RootStoreImpl';
import config from '@/config';
import vClickOutside from 'v-click-outside'; // FIXME : move to 'vue-global-events' after upgrade to vue3

// moment js (date and time formatting)
import moment from 'moment';

// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// font-awesome
import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome';
import './fontawesome';
import {StompClient} from '@/api/StompClient';

// add font awesome component
Vue.component('fa-icon', FontAwesomeIcon);
Vue.component('fa-layers', FontAwesomeLayers);

// set date and time locale
moment.locale(navigator.language);
Vue.use(Vuex);
Vue.use(vClickOutside);
Vue.config.productionTip = false;

config.load()
  .then(() => {
      StompClient.initialize();
      new VueAdapter({
              router,
              store: rootStore,
              render: (h) => h(App),
          })
      .$mount('#app');
  })
  .catch((error) => console.log(error));


