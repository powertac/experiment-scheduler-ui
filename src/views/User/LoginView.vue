<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import api from '@/api/api';

@Component
export default class LoginView extends Vue {

  private username: string;
  private password: string;

  constructor() {
    super();
    this.username = 'admin';
    this.password = 'supersecure';
  }

  private auth(): void {
    api.orchestrator.auth.login({username: this.username, password: this.password})
        .then(() => this.$store.commit('setAuthenticated', true))
        .catch((error) => console.error("could not login", error));
  }

}
</script>

<template>
  <div class="login">
    <div>
      <h2>PowerTAC</h2>
      <h4>Experiment Manager</h4>
      <form @submit="auth">
        <div>
          <label for="username">Username or email address</label>
          <input type="text" class="text-input" id="username" v-model="username">
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" class="text-input" id="password" v-model="password">
        </div>
        <button type="submit" class="mt-2 button">Login</button>
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
