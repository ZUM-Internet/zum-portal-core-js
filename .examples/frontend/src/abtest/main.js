import Vue from 'vue';
import App from './App';

if (process.env.NODE_ENV === 'production' || process.env.ZUM_BACK_MODE === 'deploy') {
  Vue.config.devtools = false;
  Vue.config.productionTip = false;
}

new Vue({
  el: '#app',
  render: h => h(App),
});
