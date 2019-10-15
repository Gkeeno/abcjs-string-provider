<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your project" /> -->
    <section>
      <h2>1. run-demo</h2>
      <button @click="rundemo()">run-demo</button>&nbsp;
      <button @click="pitchup()">pitchup</button>
      <button @click="accidential()">accidential</button>
      <button @click="del()">del</button>
    </section>

    <section>
      <h2>2. abcString-rende-engine</h2>
      <button @click="generatAbc">generate abcstring</button>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import { Stave } from '../abcString-render-engine/Stave/Stave';
import { Note, NoteKey, NoteDuration } from '../abcString-render-engine';
import { NoteAccidental } from '../abcString-render-engine/Enums/NoteAccidental';
// import { rundemo } from '../abcString-render-engine';

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  public stave: Stave;
  public note1: Note;
  public note2: Note;

  public rundemo() {
    this.stave = new Stave().init();
    this.note1 = new Note(NoteKey.C1, NoteDuration.Whole);
    this.note2 = new Note(NoteKey.F3, NoteDuration.Whole);
    this.stave.addNotation(this.note1);
    this.stave.addNotation(this.note2);
  }

  public pitchup() {
    this.note1.pitchUp();
    console.log(this.stave.abcString);
  }
  public accidential() {
    this.note1.setAccidential(NoteAccidental.DoubleSharp);
    console.log(this.stave.abcString);
  }
  public del() {
    this.stave.deleteNotation(this.note1);
    console.log(this.stave.abcString);
  }

  public generatAbc() {
    // for (const i of this.stave.notations) {
    //   console.log(i.ibegin,i.iend);
    // }
  }
}
</script>
