import Vue from 'vue';
import App from './App';

export default function createApp() {
  return new Vue({
    el: '#app',
    render: h => h(App),
  });
}
