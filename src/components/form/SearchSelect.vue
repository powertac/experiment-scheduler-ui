<template>
    <div class="search-select dropdown" id="hans">
        <div contenteditable="true" class="form-control" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            SomeStuff
        </div>
        <div class="dropdown-menu select-options" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" v-for="item in items" :href="handleCallback(item)">{{item.name}}</a>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class SearchSelect extends Vue {

        @Prop({required: true})
        public items: any[];

        @Prop({required: true})
        public callback: (arg0: any) => any;

        private handleCallback(item: any) {
            this.callback(item);
        }

    }
</script>

<style scoped lang="scss">
    .select-options {
        width: 100%;
    }
</style>