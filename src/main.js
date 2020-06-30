import Vue from 'vue';
import App from './App.vue';
import {BootstrapVue, IconsPlugin, BootstrapVueIcons } from 'bootstrap-vue';

Vue.config.productionTip = false;

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(BootstrapVueIcons);

new Vue({
  render: h => h(App),
}).$mount('#app');
