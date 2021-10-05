import {RootStore} from './domain/Store/RootStore';
import Vue from 'vue';

export class VueAdapter extends Vue {
    public $store: RootStore;
}
