<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your project" /> -->
    <section>
      <h2>1. run-demo</h2>
      <button @click="rundemo()">run-demo</button>
    </section>

    <section>
      <h2>2. abcString-rende-engine</h2>
      <button>generate abcstring</button>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { rundemo } from '../abcString-render-engine';

@Component({
	components: {
		HelloWorld
	}
})
export default class Home extends Vue {
	rundemo() {
    var store = rundemo();
    console.log(store.state);
    
		store.commit('increment');
	}
}
</script>
