import Vue from 'vue';
import App from './App';

export default function createApp() {
  return new Vue({
    render: h => h(App),
  });
}
