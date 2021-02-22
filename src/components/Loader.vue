<template>
    <div class="loader">
        <div class="centered">
            <div class="thing">
                <div class="square sq1"></div>
                <div class="square sq2"></div>
                <div class="square sq3"></div>
            </div>
            <div class="thing-shadow"></div>
            <h4>Waiting for Orchestrator ...</h4>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import {VueAdapter} from '../VueAdapter';

    @Component
    export default class Loader extends VueAdapter {

    }
</script>

<style lang="scss" scoped>
    div.loader {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @keyframes cube {
        0%   {transform: translateY(0) translateX(1.5rem) rotateZ(35deg);}
        25%  {transform: translateY(0) translateX(1.5rem) rotateZ(35deg);}
        30%  {transform: translateY(-.5rem) translateX(1.5rem) rotateZ(37deg);}
        33%  {transform: translateY(.1rem) translateX(1.5rem) rotateZ(33deg);}
        40%  {transform: translateY(0) translateX(1.5rem) rotateZ(35deg);}
        50%  {transform: translateY(-1rem) translateX(1.5rem) rotateZ(36deg);}
        54%  {transform: translateY(.1rem) translateX(1.5rem) rotateZ(34deg);}
        56%  {transform: translateY(0) translateX(1.5rem) rotateZ(35deg);}
        60%  {transform: translateY(0) translateX(1.5rem) rotateZ(35deg);}
        72%  {transform: translateY(-3.5rem) translateX(1.5rem) rotateZ(34deg);}
        80%  {transform: translateY(.2rem) translateX(1.5rem) rotateZ(35deg);}
        100% {transform: translateY(0) translateX(1.5rem) rotateZ(35deg);}
    }

    div.thing {;
        display: flex;
        justify-content: center;
        margin-bottom: 0;
        transform: translateX(1.5rem) rotateZ(35deg);
        animation: cube 3.5s infinite;
        z-index: 999;
    }

    @keyframes shadow {
        0%   {box-shadow: 0 0 2.5rem 2.2rem #aaafaa;}
        25%  {box-shadow: 0 0 2.5rem 2.2rem #aaafaa;}
        30%  {box-shadow: 0 0 2.5rem 2.3rem #aaafaa;}
        33%  {box-shadow: 0 0 2.5rem 2.1rem #aaafaa;}
        40%  {box-shadow: 0 0 2.5rem 2.2rem #aaafaa;}
        50%  {box-shadow: 0 0 2.5rem 2.4rem #aaafaa;}
        54%  {box-shadow: 0 0 2.5rem 2.1rem #aaafaa;}
        56%  {box-shadow: 0 0 2.5rem 2.2rem #aaafaa;}
        60%  {box-shadow: 0 0 2.5rem 2.2rem #aaafaa;}
        72%  {box-shadow: 0 0 3rem 3rem #bbbfbb;}
        80%  {box-shadow: 0 0 2rem 2.2em #aaafaa;}
        100% {box-shadow: 0 0 2.5rem 2.2rem #aaafaa;}
    }

    div.thing-shadow {
        width: 1px;
        height: 1px;
        background: rgba(0,0,0, .5);
        box-shadow: 0 0 5rem 3rem #555;
        transform: translateX(8.1rem) translateY(-3rem) rotateX(50deg) rotateZ(55deg);
        z-index: 990;
        animation: shadow 3.5s infinite;
    }

    div.square {
        width: 4rem;
        height: 4rem;

        &.sq1 {// left
            background: #44A6B3;
            transform: rotateY(45deg) rotateX(45deg);
        }

        // top
        &.sq2 {
            background: #60ECFF;
            transform: rotateY(45deg) rotateX(-45deg) translateY(-4rem) translateX(-8.5rem) translateZ(.02rem);
        }

        &.sq3 {// right
            background: #4EBDCC;
            transform: translateX(-5.61rem) translateY(-1.39rem) translateZ(.02rem) rotateY(45deg) rotateZ(45deg) ;
        }
    }

    h4 {
        margin-top: 2.5rem;
    }
</style>