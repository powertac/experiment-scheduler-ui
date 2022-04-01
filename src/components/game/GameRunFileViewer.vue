<template>
  <div class="game-runs" v-on:mousemove="resizeX" v-on:click="stopResizeX">
    <div class="run-navigator" :style="{'width': width + 'px'}">
      <run :run="run" v-for="run in game.runs" :key="run.id" />
    </div>
    <div class="resizer" :class="{'active': resizable}"
         v-on:mousedown="startResizeX"
         v-on:mouseup="stopResizeX">
      <div class="resizer-center-line"></div>
    </div>
    <file-viewer :content="sample" />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Game from '@/domain/Game/Game';
import FormattedDate from '@/components/time/FormattedDate.vue';
import GameRunNavigationItem from '@/components/game/GameRunNavigationItem.vue';
import FileViewer from '@/components/file/FileViewer.vue';
import MouseMoveEvent = JQuery.MouseMoveEvent;

@Component({components: {'date': FormattedDate, 'run': GameRunNavigationItem, 'file-viewer': FileViewer}})
export default class GameRunFileViewer extends Vue {

  private resizable: boolean;
  private width: number|null;

  @Prop({required: true})
  private game: Game;

  constructor() {
    super();
    this.resizable=false;
    this.width = null;
  }

  private startResizeX(): void {
    this.resizable = true;
  }

  private resizeX(event: MouseMoveEvent): void {
    if(this.resizable) {
      console.log(event);
      this.width = Math.round(event.clientX - (<DOMRect> this.$el.getBoundingClientRect()).x) - 5;
    }
  }

  private stopResizeX(): void {
    this.resizable = false;
  }

  get sample(): string {
    return `package org.powertac.is3broker.prediction;

import org.powertac.common.Competition;
import org.powertac.common.WeatherForecast;
import org.powertac.samplebroker.interfaces.BrokerContext;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class ExampleVectorPublisher extends AbstractPredictionVectorPublisher<ExampleVector> {

    private final ExampleVectorRepository vectorRepository;

    private String gameId;
    private Integer currentTimeslot;
    private ExampleVector currentVector;
    private final AtomicBoolean isPublished = new AtomicBoolean(false); // using AtomicBoolean here for thread-safety

    public ExampleVectorPublisher(ExampleVectorRepository vectorRepository) {
        this.vectorRepository = vectorRepository;
    }

    @Override
    public synchronized void initialize(BrokerContext context) {
        // reset all game-related information once a new game starts
        gameId = null;
        activate(-1);
    }

    @Override
    public synchronized void activate(int timeslot) {
        // reset all timeslot-related information once a new timeslot starts
        currentTimeslot = timeslot;
        isPublished.set(false);
        currentVector = new ExampleVector(gameId, timeslot);
    }

    @Override
    protected synchronized boolean isReady() {
        return true;
    }

    @Override
    protected synchronized void publish() {
        if (!isPublished.get()) {
            vectorRepository.save(currentVector);
            isPublished.set(true);
        }
    }

    public void handleMessage(Competition competition) {
        gameId = competition.getName();
    }

    public void handleMessage(WeatherForecast forecast) {
        currentVector.weatherForecastArrived = true;
        if (isReady()) publish();
    }

}`;
  }

}
</script>

<style lang="scss">
.game-runs {
  display: flex;
  flex-grow: 1;
  overflow: auto;
}
div.run-navigator {
  display: flex;
  width: 16.6rem;
  overflow: auto;
}
div.resizer {
  display: flex;
  justify-content: center;
  background: transparent;
  width: 11px;
  cursor: ew-resize;
  z-index: 100;
  border: 0 solid transparent;
  margin: 0 -5px;
  &:hover {
    background: rgba(147, 161, 161, .2);
  }
  .resizer-center-line {
    width: 1px;
    align-self: stretch;
    background: #93a1a1;
  }
}
</style>
