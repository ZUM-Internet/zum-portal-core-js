import Vue from "vue";

export function handleDevtool () {
  if (process.env.NODE_ENV === 'production' || process.env.ZUM_BACK_MODE === 'deploy') {
    Vue.config.devtools = false;
    Vue.config.productionTip = false;

  } else {
    Vue.config.devtools = true;
    Vue.config.productionTip = true;
  }
}