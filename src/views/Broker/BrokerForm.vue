<template>
  <div id="broker-form">
    <div class="content-actions">
      <button type="button" class="content-action" @click="$router.back()">
        <fa-icon icon="arrow-left" class="content-action-icon"/>
        Back
      </button>
    </div>
    <div class="form-container">
      <h2 class="form-container-title">New Broker</h2>
      <div class="field-group">
        <label class="field-group-title le">Image tag</label>
        <div class="field-group-body">
          <autocomplete :items="availableImageTags"
                        :initial-value="imageTag"
                        @item-selected="chooseImageTag($event)"
                        @item-changed="chooseImageTag($event)"/>
          <p v-if="imageTag.length > 2 && !imageExists">
            The image you are referring to does not exists. The broker will not be available until the corresponding
            image is created.
          </p>
        </div>
      </div>
      <div class="field-group">
        <label class="field-group-title le">Name</label>
        <div class="field-group-body">
          <autocomplete :items="brokerNames"
                        :initial-value="name"
                        @item-selected="chooseName($event)"
                        @item-changed="chooseName($event)"/>
        </div>
      </div>
      <div class="field-group">
        <label for="broker-version" class="field-group-title le">Version</label>
        <div class="field-group-body">
          <input type="text" v-model="version" class="form-control" id="broker-version">
        </div>
      </div>
      <div class="field-group alternative-actions">
        <div class="field-group-body">
          <div class="control-button" @click="closeForm">
            <div class="control-button-icon">
              <fa-icon icon="times"/>
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
              <fa-icon icon="check"/>
            </div>
            <div class="control-button-text">
              Create broker
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';
import {Broker, BrokerImpl} from '@/domain/Broker/Broker';
import api from '@/api/api';

@Component({components: {'autocomplete': Autocomplete}})
export default class BrokerForm extends Vue {

  private name: string;
  private version: string;
  private imageTag: string;
  private readonly enabled: boolean;
  private availableImages: Image[];

  constructor() {
    super();
    this.name = '';
    this.version = '';
    this.imageTag = '';
    this.enabled = true;
    this.availableImages = [];
  }

  private created(): void {
    this.$store.dispatch('brokers/loadAll');
    api.orchestrator.application.images()
        .then((images) => this.availableImages.push(...images))
        .catch((error) => console.log(error));
  }

  get brokers(): Broker[] {
    return this.$store.getters['brokers/findAll'];
  }

  get brokerNames(): string[] {
    const names = this.brokers.slice().map((b) => b.name);
    return [...new Set(names)]
  }

  get availableImageTags(): string[] {
    return this.availableImages.slice()
        .map((i) => i.tag)
        .sort();
  }

  get isValid(): boolean {
    return this.name.length > 2
        && this.isValidVersion
        && this.imageTag.length > 2;
  }

  get isValidVersion(): boolean {
    return this.version.length > 2
        && !this.brokers.reduce(
            (exists: boolean, b: Broker) => exists || (b.name === this.name && b.version === this.version), false);
  }

  get imageExists(): boolean {
    return this.availableImages.reduce((hasMatch: boolean, i: Image) => hasMatch || i.tag === this.imageTag, false)
  }

  private chooseName(name: string): void {
    this.name = name;
  }

  private chooseImageTag(tag: string): void {
    this.imageTag = tag;
  }

  private closeForm(): void {
    this.$router.back();
  }

  private submit(): void {
    const broker: Broker = new BrokerImpl(
        undefined,
        this.name,
        this.version,
        this.imageTag,
        this.enabled);
    api.orchestrator.brokers.create(broker);
    this.$router.back();
  }

}
</script>

<style lang="scss" scoped>

#broker-form {
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
