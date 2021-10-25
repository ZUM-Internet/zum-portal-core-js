if (process.env.NODE_ENV === 'production' || process.env.ZUM_BACK_MODE === 'deploy') {
  Vue.config.devtools = false;
  Vue.config.productionTip = false;
}
