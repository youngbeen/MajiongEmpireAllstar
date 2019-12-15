import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faHeart,
  faBolt,
  faCheckCircle,
  faShieldAlt,
  faAngleDoubleUp,
  faAngleDoubleDown,
  faSkullCrossbones,
  faTheaterMasks,
  faHandRock,
  faCrosshairs,
  faDice,
  faListOl,
  faSyncAlt,
  faAward
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
require('./assets/css/base.css')

library.add(faHeart)
library.add(faBolt)
library.add(faCheckCircle)
library.add(faShieldAlt)
library.add(faAngleDoubleUp)
library.add(faAngleDoubleDown)
library.add(faSkullCrossbones)
library.add(faTheaterMasks)
library.add(faHandRock)
library.add(faCrosshairs)
library.add(faDice)
library.add(faListOl)
library.add(faSyncAlt)
library.add(faAward)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
