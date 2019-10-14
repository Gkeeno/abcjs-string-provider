import Vue from 'vue';
import store from './store';
import App from './App.vue';
import router from './router';
import 'font-awesome/css/font-awesome.min.css';
import 'abcjs/abcjs-midi.css';
// import 'amfe-flexible';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
