import {RootStore} from './domain/types/RootStore';
import Vue from 'vue';

export class VueAdapter extends Vue {
    public $store: RootStore;
}
