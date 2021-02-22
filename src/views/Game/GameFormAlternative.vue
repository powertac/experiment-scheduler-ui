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
            <broker-selector :types="availableTypes"
                             :callback="setBrokers"/>
          </div>
        </div>
        <div class="field-group">
          <h5 class="field-group-title">Server Parameters</h5>
          <div class="field-group-body">
            <parameter v-for="param in serverParameters" :key="param.id"
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
    import {Parameter, TransientParameter} from '@/domain/types/Parameter';
    import uuid from 'uuid/v4';
    import {RestClient} from '@/api/RestClient';
    import ParameterInput from '@/components/form/ParameterInput.vue';
    import {Broker, BrokerType} from '@/domain/types/Broker';
    import BrokerSelector from '@/components/BrokerSelector.vue';
    import {BrokerSpec} from '@/domain/Broker/BrokerSpec';
    import {StompClient} from "@/api/StompClient";
    import {JobRequest} from "@/domain/types/Job";

    @Component({components: {'broker-selector': BrokerSelector, 'parameter': ParameterInput}})
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

        constructor() {
            super();
            this.name = "";
            this.$set(this, 'serverParameters', []);
            this.brokers = [];
            this.allowedParameters = [];
        }

        private created(): void {
            this.serverParameters.push({
                id: uuid(),
                key: '',
                value: '',
            });
            this.$store.dispatch('brokers/refresh');
            RestClient.supportedParams()
                .then((params) => this.allowedParameters = params.sort())
                .catch((e) => console.log(e));
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

        get availableTypes(): BrokerType[] {
            return this.$store.getters['brokers/types'];
        }

        get isValid(): boolean {
            if (this.withName && this.name === '') {
                return false;
            }
            if (this.brokers.length < 1) {
                return false;
            }
            return true;
        }

        private setBrokers(brokers: Broker[]): void {
            this.brokers = brokers;
        }

        private removeBroker(broker: Broker): void {
            this.$delete(this.brokers, this.brokers.indexOf(broker));
        }

        private submit(): void {
            if (!this.isValid) {
                return;
            }
            let brokerSpecs: BrokerSpec[] = this.brokers.map((broker) => {
                return {
                    name: broker.name,
                    version: 'latest'
                }
            });
            const parameters: Parameter[] = [];
            this.serverParameters
                .filter((param) => param.key !== '')
                .filter((param) => param.value !== '')
                .forEach((param) => parameters.push({key: param.key, value: param.value}));

            if (this.isEmbedded) {
              this.$emit('form:submit', {
                name: this.name,
                brokers: brokerSpecs,
                serverParameters: parameters
              });
            }
            else {
              RestClient.createGameInstance({
                name: this.name,
                brokers: brokerSpecs,
                serverParameters: parameters
              }).then(() => this.$router.push('/games'));
            }
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

  // TODO : elevate to App
  div.content-actions {
    height: 2.75rem;
    justify-self: stretch;
    display: flex;
    align-items: stretch;
    position: sticky;
    top: 0;
    background: #fff;
    background: #fafafa;
    border-bottom: 1px solid #ddd;

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
