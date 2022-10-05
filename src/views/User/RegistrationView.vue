<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import api from '@/api/api';

@Component
export default class RegistrationView extends Vue {

  private tokenValid: boolean;
  private username: string;
  private password: string;
  private passwordRepeat: string;

  constructor() {
    super();
    this.tokenValid = false;
    this.username = '';
    this.password = '';
    this.passwordRepeat = '';
  }

  private created(): void {
    api.orchestrator.users.verifyRegistrationToken(this.token)
        .then(() => this.tokenValid = true)
        .catch((error) => console.error("invalid registration token", error));
  }

  get token(): string {
    return this.$route.params.token;
  }

  private register(): void {
    if (this.password.trim() !== this.passwordRepeat.trim()) {
      console.error("PASSWORDS DO NOT MATCH");
    } else {
      console.error("REGISTRATION NOT IMPLEMENTED");
    }
  }

}
</script>

<template>
  <div class="login">
    <div>
      <h2>PowerTAC</h2>
      <h4>Experiment Manager</h4>
      <form @submit="register">
        <div>
          <label for="username">Username</label>
          <input type="text" class="text-input" id="username" v-model="username">
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" class="text-input" id="password" v-model="password">
        </div>
        <div>
          <label for="password">Repeat Password</label>
          <input type="password" class="text-input" id="password" v-model="passwordRepeat">
        </div>
        <button type="submit" class="mt-2 button">Register</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
div.login {
  font-family: "Assistant", sans-serif;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: -3rem;

  h2 {
    font-weight: 600;
    margin: 0;
  }

  h4 {
    margin: 0;
  }

  form {
    width: 30rem;
    margin-top: 2rem;

    & > div {
      label, input {
        display: block;
        width: 100%;
      }
      margin-bottom: 1rem;
    }
  }
}
</style>
