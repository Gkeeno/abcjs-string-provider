<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">SingleTrack</router-link>|
      <router-link to="/double-track">DoublTrack</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/canvasIndex">canvasIndex</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="less">
@import '~@/styles/reset.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
