<template>
    <div id="game-form">
      <div class="content-actions">
        <button type="button" class="content-action" @click="$router.back()">
          <fa-icon icon="arrow-left" class="content-action-icon" />
          Back
        </button>
      </div>
      <div class="form-container">
        <h2 class="form-container-title">New Game</h2>
        <div class="field-group">
          <label for="game-name" class="field-group-title le">Base game<br><small class="size">(optional)</small></label>
          <div class="field-group-body">
            <game-selector @game-selected="setBaseGame($event)"
                           :initial-value="baseGame"
                           :filter="(game) => game.isValidTemplate" />
            <p class="field-group-description">
              Choosing a base game will set the new game's bootstrap and seed file to the ones provided by the base game.
            </p>
            <p v-if="!validBaseGame" class="text-danger font-italic font-weight-bold">This game has either no bootstrap file or no state log.</p>
            <table v-if="baseGame !== null && validBaseGame" class="mt-2">
              <tr>
                <th class="pr-2 text-uppercase font-weight-normal" style="color: #555; font-size: .75em">Bootstrap</th>
                <td><code>{{baseGame.files['BOOTSTRAP']}}</code></td>
              </tr>
              <tr>
                <th class="text-uppercase font-weight-normal" style="color: #555; font-size: .75em">Seed</th>
                <td><code>{{baseGame.files['STATE_LOG']}}</code></td>
              </tr>
            </table>
          </div>
        </div>
        <div class="field-group">
          <label for="game-name" class="field-group-title le">Name</label>
          <div class="field-group-body">
            <input type="text" v-model="name" class="form-control" id="game-name">
            <p class="field-group-description">
              Choosing descriptive names actually improves the usability of the system if you need to manage a lot of games ;)
            </p>
          </div>
        </div>
        <div class="field-group">
          <h5 class="field-group-title">Brokers</h5>
          <div class="field-group-body">
            <broker-selector :initially-selected="this.brokers" v-on:selected="setBrokers" />
          </div>
        </div>
        <div class="field-group">
          <h5 class="field-group-title">Server parameters</h5>
          <div class="field-group-body">
            <parameter v-for="param in serverParameters" :key="param.id"
                       :initial-key="param.key"
                       :initial-value="param.value"
                       :allowedParameters="allowedParameters"
                       :enableRemove="isParameterRemovable(param)"
                       @param-updated="updateParam(param, $event)"
                       @param-removed="removeParam(param)" />
            <p class="field-group-description">
              These parameters will apply to the game during simulation. They do not affect the bootstrap run. For a full
              reference of configurable parameters, please refer to the
              <a href="https://github.com/powertac/server-distribution/blob/master/config/server.properties" target="_blank">
                <code>server.properties</code> file on GitHub <fa-icon icon="external-link-square-alt" /></a>.
            </p>
          </div>
        </div>
        <div class="field-group alternative-actions">
          <div class="field-group-body">
            <div class="control-button" @click="closeForm">
              <div class="control-button-icon">
                <fa-icon icon="times" />
              </div>
              <div class="control-button-text">
                Cancel
              </div>
            </div>
            <div class="alternative-actions-separator">
              OR
            </div>
            <div class="control-button confirm"
                 :class="{disabled: !isValid}"
                 @click="submit">
              <div class="control-button-icon">
                <fa-icon icon="check" />
              </div>
              <div class="control-button-text">
                {{formSubmitLabel}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {TransientParameter} from '@/domain/types/Parameter';
import uuid from 'uuid/v4';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import ParameterInput from '@/components/form/ParameterInput.vue';
import GameSelector from '@/components/game/GameSelector.vue';
import {GameInterface} from '@/domain/Game/GameInterface';
import BrokerSelector from '@/components/Broker/BrokerSelector.vue';
import {Broker} from '@/domain/Broker/Broker';
import {GameSpec} from '@/domain/Game/GameSpec';

@Component({components: {'parameter': ParameterInput, 'game-selector': GameSelector, 'broker-selector': BrokerSelector}})
export default class GameForm extends Vue {

    @Prop({required: false, default: 'New Game'})
    private formTitle: string;

    @Prop({required: false, default: 'Queue game'})
    private formSubmitLabel: string;

    @Prop({required: false, default: true})
    private withName: boolean;

    @Prop({required: false, default: false})
    private isEmbedded: boolean;

    private name: string;
    private serverParameters: TransientParameter[];
    private brokers: Broker[];
    private allowedParameters: string[];
    private baseGame: GameInterface | null;

    constructor() {
        super();
        this.name = "";
        this.$set(this, 'serverParameters', []);
        this.brokers = [];
        this.allowedParameters = [];
        this.baseGame = null;
    }

    private created(): void {
        this.serverParameters.push({id: uuid(), key: '', value: ''});
        this.$store.dispatch('brokers/subscribe');
        OrchestratorClient.supportedParams()
            .then((params) => this.allowedParameters = params.sort())
            .catch((e) => console.log(e));
        const gameId = this.$route.params.id;
        if (gameId != undefined) {
          this.setBaseGame(this.$store.getters['games/find'](gameId))
        }
    }

    private setBaseGame(game: GameInterface | null): void {
      if (null == game) return
      this.name = game.name
      this.brokers = game.brokers;
      this.baseGame = game
      this.$set(this, 'serverParameters', []);
      for (const param of Object.keys(game.serverParameters)) {
        this.serverParameters.push({
          id: uuid(),
          key: param,
          value: game.serverParameters[param]})
      }
    }

    private updateParam(oldParam: TransientParameter, newParam: TransientParameter): void {
        newParam.id = oldParam.id;
        this.$set(this.serverParameters, this.serverParameters.indexOf(oldParam), newParam);
    }

    private removeParam(param: TransientParameter): void {
        this.$delete(this.serverParameters, this.serverParameters.indexOf(param));
    }

    private isParameterRemovable(param: TransientParameter): boolean {
        return this.serverParameters.length > 1 && !(
            this.serverParameters.indexOf(param) === (this.serverParameters.length - 1)
            && param.key === ''
            && param.value === '');
    }

    @Watch('serverParameters')
    private onServerParametersChanged(params: TransientParameter[]): void {
        if (params.filter((param) => param.key === '' && param.value === '').length < 1) {
            this.serverParameters.push({
                id: uuid(),
                key: '',
                value: '',
            });
        }
    }

    get isValid(): boolean {
        if (this.withName && this.name === '') {
            return false;
        }
        if (this.brokers.length < 1) {
            return false;
        }
        return this.validBaseGame;
    }

    get validBaseGame(): boolean {
      if (null == this.baseGame) {
        return true
      }
      return this.baseGame.isValidTemplate;
    }

    private setBrokers(brokers: Broker[]): void {
      this.brokers = brokers;
    }

    private submit(): void {
      if (!this.isValid) {
          return;
      }
      if (this.isEmbedded) {
        this.$emit('form:submit', this.createGameSpec());
      }
      else {
        OrchestratorClient.createGame(this.createGameSpec())
            .then(() => this.$router.push('/games'));
      }
    }

    private createGameSpec(): GameSpec {
      const parameters: {[key: string]: string} = {};
      this.serverParameters
          .filter((param) => param.key !== '')
          .filter((param) => param.value !== '')
          .forEach((param) => parameters[param.key] = param.value);
      return {
        name: this.name,
        baseGameId: this.baseGame != null ? this.baseGame.id : undefined,
        brokers: this.brokers,
        serverParameters: parameters
      };
    }

    private closeForm() {
      if (this.isEmbedded){
        this.$emit('form:close');
      }
      else {
        this.$router.back()
      }
    }

}
</script>

<style lang="scss" scoped>

  #game-form {
    background: #fafafa;
  }

  div.content-actions {
    height: 2.75rem;
    justify-self: stretch;
    display: flex;
    align-items: stretch;
    position: sticky;
    top: 0;
    background: #fafafa;
    border-bottom: 1px solid #ddd;
    flex-shrink: 0;

    .content-action {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      margin: 0;
      border: 0;
      background: transparent;
      color: #3071F2;

      &:hover {
        color: #fff;
        background: #3071F2;
      }

      .content-action-icon {
        margin-right: .5em;
      }
    }
  }


  div.form-container {

    .field-group {
      display: flex;
      background: #fff;
      padding: 2rem 5rem 4rem 5rem;
      border-top: 1px solid #e9e9e9;
      border-radius: .2rem;

      &:last-child {
        margin-bottom: 3rem;
        border-bottom: 1px solid #e9e9e9;
      }

      &.alternative-actions {
        padding: 1.5rem 5rem 1.5rem 20rem;
        background: #fafafa;
        border-bottom: 0;

        .field-group-body {
          display: flex;
          flex-direction: row;
          align-items: stretch;

          & > .control-button {
            flex-grow: 1;
          }

          .alternative-actions-separator {
            display: flex;
            align-items: center;
            margin: 0 1.5em;
          }
        }
      }

      .field-group-title {
        width: 15rem;
        font-size: 1.25em;
        line-height: 1.2;
        margin: .44rem 0 .5rem 0;
      }

      .field-group-body {
        width: 60rem;
      }

      .field-group-description {
        margin-top: .75rem;
        margin-bottom: 0;
      }

      input + .field-group-description {
        margin-top: .75rem;
        margin-bottom: 0;
      }

      .field-group-description {
        color: #555;
      }
    }

    .form-container-title {
      margin: 3rem auto 1.5rem 20rem;
      color: #555;
    }

    input[type=text].form-control {
      border-radius: 0;
      padding: .5rem 1rem;
      height: 2.75rem;
      color: #333;
      transition: none;
      line-height: 1.5;
      font-size: 1rem;
      &:focus {
        box-shadow: none;
        background: #f1f6ff;
        color: #000aa3;
        border-color: #A5B3E8;
      }
    }
  }
</style>
