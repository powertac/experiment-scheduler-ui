<template>
  <div id="baseline-form">
    <div class="action-bar">
      <button type="button" @click="$router.back()">
        <fa-icon icon="arrow-left" class="icon-left"  />
        Back
      </button>
    </div>
    <div class="form">
      <h2 class="form-title">New baseline</h2>
      <div class="field-group">
        <label for="baseline-name" class="field-group-title">Name</label>
        <div class="field-group-body">
          <input type="text" v-model="name" class="form-control" id="baseline-name">
        </div>
      </div>
      <div class="field-group">
        <label class="field-group-title">Instances</label>
        <div class="field-group-body">
          <div class="alternative-actions" v-if="!addInstanceOpen">
            <div class="control-button" @click="addInstanceOpen = true">
              <div class="control-button-icon"> + </div>
              <div class="control-button-text">Add instance</div>
            </div>
            <div class="alternative-actions-separator">
              OR
            </div>
            <div class="control-button" @click="addInstanceOpen = true">
              <div class="control-button-icon"> + </div>
              <div class="control-button-text">Select game</div>
            </div>
          </div>
          <instance-form v-if="addInstanceOpen"
                         :form-title="'New instance'"
                         :form-submit-label="'Add instance'"
                         :with-name="true"
                         v-on:form:close="addInstanceOpen = false"
                         v-on:form:submit="addInstance" />
          <div class="baseline-instances mt-2 mb-4">
            <div class="baseline-instance" v-for="(instance, index) in instances">
              <div class="baseline-instance-index">
                {{ instanceIndex(index) }}
              </div>
              <div class="baseline-instance-body">
                <div class="baseline-instance-brokers">
                  <div class="broker-pill" v-for="broker in instance.brokers">
                    {{broker.name}}
                  </div>
                </div>
                <div class="baseline-instance-parameters" v-if="instance.serverParameters.length > 0">
                  <div class="server-parameter" v-for="param in instance.serverParameters">
                    <code>{{param.key}} = {{param.value}}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              Create baseline
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
import EmbeddedGameForm from '@/views/Game/EmbeddedGameForm.vue';

@Component({components: {'instance-form': EmbeddedGameForm}})
export default class BaselineForm extends Vue {

  private name: string;
  private instances: GameSpec[];
  private addInstanceOpen: boolean;

  constructor() {
      super();
      this.name = '';
      this.instances = [];
      this.addInstanceOpen = true;
  }

  get isValid() {
    return false;
  }

  private addInstance(instance: GameSpec): void {
    this.instances.push(instance);
    this.addInstanceOpen = false;
  }

  private submit() {

  }

}
</script>

<style lang="scss" scoped>
#baseline-form {
  background: var(--shade1);
}
</style>
