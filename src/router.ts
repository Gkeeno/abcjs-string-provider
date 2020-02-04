import Vue from 'vue';
import Router from 'vue-router';
import SingleTrack from './views/SingleTrack.vue';
import DoubleTrack from './views/DoubleTrack.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: SingleTrack
    },
    {
      path: '/double-track',
      name: '',
      component: DoubleTrack
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/canvasIndex',
      name: 'canvasIndex',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/canvas/index.vue'),
      meta: {
        title: '画布'
      }
    }
  ]
});
