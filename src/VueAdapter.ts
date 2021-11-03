import {RootStoreState} from './domain/Store/RootStore';
import Vue from 'vue';
import {Store} from 'vuex';

export class VueAdapter extends Vue {
    public $store: Store<RootStoreState>;
}
