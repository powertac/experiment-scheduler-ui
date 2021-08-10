<template>
  <div id="experiment-form">
    <div class="content-actions">
      <button type="button" class="content-action" @click="$router.back()">
        <fa-icon icon="arrow-left" class="content-action-icon" />
        Back
      </button>
    </div>
    <div class="form-container">
      <h2 class="form-container-title">New Experiment</h2>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Name</label>
        <div class="field-group-body">
          <input type="text" v-model="name" class="form-control" id="game-name">
          <p class="field-group-description">
            Choosing descriptive names actually improves the usability of the system if you need to manage a lot of experiments ;)
          </p>
        </div>
      </div>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Baseline</label>
        <div class="field-group-body">
          <div class="control-button" @click="addInstanceOpen = true" v-if="!addInstanceOpen">
            <div class="control-button-icon"> + </div>
            <div class="control-button-text">Add baseline instance</div>
          </div>
          <instance-form v-if="addInstanceOpen"
                         :form-title="'New Instance'"
                         :form-submit-label="'Add instance'"
                         :with-name="false"
                         :is-embedded="true"
                         v-on:form:close="addInstanceOpen = false"
                         v-on:form:submit="addInstance" />
          <div class="baseline-instances mt-2 mb-4">
            <div class="baseline-instance" v-for="(instance, index) in baseline">
              <div class="baseline-instance-index">
                {{ instanceIndex(index) }}
              </div>
              <div class="baseline-instance-body">
                <div class="baseline-instance-brokers">
                  <div class="broker-pill" v-for="broker in instance.brokers">
                    {{broker.name}} <!--<code>[{{broker.name}}:{{broker.version}}]</code>-->
                  </div>
                </div>
                <div class="baseline-instance-parameters" v-if="instance.serverParameters.length > 0">
                  <div class="server-parameter" v-for="param in instance.serverParameters">
                    <code>{{param.key}} = {{param.value}}</code>
                  </div>
                </div>
              </div>
              <!--<div class="baseline-instance-actions">
                <fa-icon icon="pen" class="fa-icon"></fa-icon>
                <fa-icon icon="copy" class="fa-icon"></fa-icon>
                <fa-icon :icon="['fas', 'trash-alt']" class="fa-icon"></fa-icon>
              </div>-->
            </div>
          </div>
        </div>
      </div>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Treatments</label>
        <div class="field-group-body">
          <treatments-form form-title="" v-on:treatments:updated="setTreatments" />
        </div>
      </div>
      <div class="field-group alternative-actions">
        <div class="field-group-body">
          <div class="control-button">
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
              Queue Experiment
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {GameSpec} from '@/domain/Game/GameSpec';
import ExperimentGameForm from '@/views/Game/ExperimentGameForm.vue';
import TreatmentsForm from '@/views/Treatment/TreatmentsForm.vue';
import {Treatment} from '@/domain/Treatment/Treatment';
import {RestClient} from '@/api/RestClient';
import {ExperimentSpec} from '@/domain/Experiment/ExperimentSpec';

@Component({components: {'instance-form': ExperimentGameForm, 'treatments-form': TreatmentsForm}})
    export default class ExperimentFormAlternative extends Vue {

        private name: string;
        private baseline: GameSpec[];
        private treatments: Treatment[];
        private addInstanceOpen: boolean;

        constructor() {
            super();
            this.name = '';
            this.baseline = [];
            this.treatments = [];
            this.addInstanceOpen = false;
        }

        get isValid(): boolean {
            return this.name !== ''
                && this.baseline.length > 0
                && this.treatments.length > 0;
        }

        get experiment(): ExperimentSpec {
            return {
                name: this.name,
                baseline: this.baseline,
                treatments: this.treatments
            };
        }

        private addInstance(instance: GameSpec): void {
            this.baseline.push(instance);
            this.addInstanceOpen = false;
        }

        private setTreatments(treatments: Treatment[]): void {
            this.treatments = treatments;
        }

        private instanceIndex(index: number): string {
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            return alphabet[index];
        }

        private submit(): void {
            if (this.isValid) {
                console.log(this.experiment);
                RestClient.createExperiment(this.experiment)
                    .then((message: string) => console.log(message))
                    .catch((error: any) => console.error(error));
                this.$router.push('/experiments');
            }
        }

        private cancel(): void {
            this.$router.back();
        }

    }
</script>

<style lang="scss" scoped>
  #experiment-form {
    background: #fafafa;
  }

  div.mdl {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  // TODO : elevate to App
  div.content-actions {
    height: 2.75rem;
    justify-self: stretch;
    display: flex;
    align-items: stretch;
    position: sticky;
    top: 0;
    background: #fafafa;
    border-bottom: 1px solid #ddd;
    z-index: 999;

    .content-action {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 0 1rem;
      margin: 0;
      border: 0;
      background: transparent;
      color: #3071F2;
      height: 2.75rem;

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

  div.baseline-instance {
    border: 1px solid #ccc;
    border-radius: .2em;
    display: flex;
    flex-wrap: wrap;

    & + .baseline-instance, & + .add-instance {
      margin-top: .5em;
    }

    &:hover .baseline-instance-actions .fa-icon {
      color: #7B93E8;
    }

    .baseline-instance-index {
      font-size: 1.5em;
      width: 3em;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .5em 1.25em .5em 1.25em;
      //background: #eaecf0;
      font-weight: bold;
    }

    .baseline-instance-brokers {
      margin: .75em 0;
      padding: .5em .875em 0 .875em;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      code {
        color: #333;
      }
    }

    .baseline-instance-parameters {
      padding: 0 .875em 1em .875em;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      code {
        color: #333;
        font-size: 1em !important;
      }
    }

    .baseline-instance-actions {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      flex-grow: 1;
      padding: 1em 1.25em;
      font-size: 1.3em;

      .fa-icon {
        color: #B5C0E8;
        &:hover {
          color: #0C3CE8;
          cursor: pointer;
        }

        & + .fa-icon {
          margin-left: .75em;
        }
      }
    }
  }
  .broker-pill {
    width: 100%;
  }
  .server-parameter {
    width: 100%;
  }
</style>
