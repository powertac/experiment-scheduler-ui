<template>
    <div class="autocomplete">
        <input type="text" class="text-input"
               :id="inputElementId"
               v-model="search"
               @focus="open"
               @keydown.down="arrowDown"
               @keydown.up="arrowUp"
               @keydown.enter="enter"
               @keydown.esc="close"
               @keydown.tab="close" />
        <div class="results" v-show="isOpen" :id="'results' + inputElementId">
            <div class="result" :id="'result' + i"
                 :class="{'active': i === selectedItemIndex}"
                 v-for="(result, i) in results"
                 :key="i" @click="selectItem(result)"
                 v-html="result">
            </div>
            <div v-if="results.length < 1" class="text-center text-muted bg-light p-2">
                There are no items matching your input.
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
    import {matchAndMark, removeHtml} from '@/util/StringUtils';
    import uuid from 'uuid/v4';

    @Component({name: 'autocomplete'})
    export default class Autocomplete extends Vue {

        @Prop({required: true})
        public items: string[];

        @Prop({required: false, default: ''})
        public initialValue: string;

        private search: string;
        private isOpen: boolean;
        private selectedItemIndex: number;
        private inputElementId: string;

        constructor() {
            super();
            this.search = '';
            this.isOpen = false;
            this.selectedItemIndex = -1;
            this.inputElementId = uuid();
            this.search = this.initialValue
        }

        private mounted() {
            document.addEventListener('click', this.handleClickOutside);
        }

        private destroyed() {
            document.removeEventListener('click', this.handleClickOutside);
        }

        @Watch('search')
        @Emit('item-changed')
        private onItemChange(item: string): string {
            return item;
        }

        @Emit('item-selected')
        private selectItem(item: string): string {
            this.search = removeHtml(item);
            this.close();
            return this.search;
        }

        get results(): string[] {
            if (!/\S/.test(this.search)) {
                return this.items;
            }
            return matchAndMark(this.search, this.items);
        }

        private handleClickOutside(event: Event) {
            if (!this.$el.contains(event.target as Node)) {
                this.close();
            }
        }

        private open(): void {
            this.isOpen = true;
            const inputElement = document.getElementById(this.inputElementId);
            const height = null != inputElement ? inputElement.offsetHeight - 1 : 0;
            const resultsElement = this.resultsElement;
            if (null != resultsElement && null != resultsElement.style) {
                resultsElement.style.top = height + 'px';
            }
        }

        private close(): void {
            this.isOpen = false;
            this.selectedItemIndex = -1;
        }

        private arrowDown() {
            if (!this.isOpen) {
                this.open();
                this.selectedItemIndex = 0;
                return;
            }
            if (this.selectedItemIndex < (this.results.length - 1)) {
                this.selectedItemIndex = this.selectedItemIndex + 1;
                return;
            }
            this.selectedItemIndex = 0;
        }

        private arrowUp() {
            if (this.selectedItemIndex > 0) {
                this.selectedItemIndex = this.selectedItemIndex - 1;
                return;
            }
            this.selectedItemIndex = this.results.length - 1;
        }

        get resultsElement(): HTMLElement|null {
            return document.getElementById('results' + this.inputElementId);
        }

        @Watch('selectedItemIndex')
        private scroll(index: number): void {

            const activeElement: HTMLElement|null = document.getElementById('result' + index);
            const resultsElement = this.resultsElement;

            if (null == resultsElement)  {
                return;
            }

            if (index <= 0 || null == activeElement) {
                resultsElement.scrollTop = 0;
                return;
            }

            if (index === this.results.length - 1) {
                resultsElement.scrollTop = activeElement.offsetTop;
            }

            const scrollZoneTopOffset = resultsElement.scrollTop + activeElement.clientHeight;

            if (activeElement.offsetTop < scrollZoneTopOffset) {
                resultsElement.scrollTop = activeElement.offsetTop - activeElement.clientHeight;
            }

            const scrollZoneBottomOffset = resultsElement.scrollTop
                + resultsElement.clientHeight
                - activeElement.clientHeight;

            if ((activeElement.offsetTop + activeElement.offsetHeight) > scrollZoneBottomOffset) {
                resultsElement.scrollTop = resultsElement.scrollTop
                    + activeElement.clientHeight;
            }
        }

        private enter() {
            if (this.selectedItemIndex < 0) {
                return;
            }
            this.selectItem(this.results[this.selectedItemIndex]);
        }

    }
</script>

<style lang="scss" scoped>

    div.autocomplete {
        position: relative;
        font-family: Inconsolata, monospace;
    }

    div.results {
        position: absolute;
        top: 2rem;
        left: 0;
        border: 1px solid #ced4da;
        border-top-color: #80bdff;
        border-radius: .2rem;
        padding: .2rem;
        z-index: 1000;
        background: #fff;
        min-width: 100%;
        max-height: 24.5rem;
        overflow-y: scroll;
    }

    div.result {
        cursor: pointer;
        padding: 4px .3rem;
        z-index: 0;
        &:hover, &.active {
            background: #F4DBFF;
        }
    }

    div.autocomplete.br-0 input.form-control {
        border-radius: 0;
    }

    div.autocomplete.br-r-0 input.form-control {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

</style>
