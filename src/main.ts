// vue
import Vue from 'vue';
import Vuex from 'vuex';
import jQuery from 'jquery';
import {VueAdapter} from '@/VueAdapter';
import App from './Application.vue';
import router from './router';
import store from './domain/Store/RootStoreImpl';
import config from '@/config';

// moment js (date and time formatting)
import moment from 'moment';

// bootstrap
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// font-awesome
import {FontAwesomeIcon, FontAwesomeLayers} from '@fortawesome/vue-fontawesome';
import './fontawesome';
import {StompClient} from '@/api/StompClient';

StompClient.initialize();

// add font awesome component
Vue.component('fa-icon', FontAwesomeIcon);
Vue.component('fa-layers', FontAwesomeLayers);

// set date and time locale
moment.locale(navigator.language);

// make jquery available to all components
// TODO : remove jquery from Vue if possible
Vue.use({
    install: (VueInstance) => VueInstance.prototype.$jQuery = jQuery,
});

Vue.use(Vuex);
Vue.config.productionTip = false;

config.load()
    .then(() => {
        new VueAdapter({
                router,
                store: new Vuex.Store(store),
                render: (h) => h(App),
            })
        .$mount('#app');
    })
    .catch((error) => console.log(error));


