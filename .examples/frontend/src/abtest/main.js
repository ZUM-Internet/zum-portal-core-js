import Vue from 'vue';
import App from './App';
import { handleDevtool } from '@zum-portal-core/frontend';

handleDevtool();

new Vue({
  el: '#app',
  render: h => h(App),
});
