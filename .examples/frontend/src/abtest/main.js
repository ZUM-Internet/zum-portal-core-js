import Vue from 'vue';
import App from './App';
import { monkeypatch } from 'zum-portal-core-js-frontend';

monkeypatch();

new Vue({
  el: '#app',
  render: h => h(App),
});
