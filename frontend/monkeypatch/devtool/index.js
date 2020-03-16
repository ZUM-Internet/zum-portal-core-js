/*
 **********************************************************
 *
 *                Vue devtool On/Off 로직
 *
 * production 모드로 기동시 Vue devtool을 비활성화한다
 *
 **********************************************************
 */
import Vue from 'vue';

if (process.env.NODE_ENV === 'production' || process.env.ZUM_BACK_MODE === 'deploy') {
  Vue.config.devtools = false;
  Vue.config.productionTip = false;

} else {
  Vue.config.devtools = true;
  Vue.config.productionTip = true;

}
