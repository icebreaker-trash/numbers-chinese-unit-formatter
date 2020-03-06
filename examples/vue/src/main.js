import Vue from 'vue'
import App from './App.vue'
import a, {
  getNumberCustomFullText as b
} from '../../../src'

Vue.config.productionTip = false
Vue.filter('a', a)
Vue.filter('b', b)
new Vue({
  render: h => h(App),
}).$mount('#app')