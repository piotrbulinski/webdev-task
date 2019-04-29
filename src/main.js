import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vendor Library 
import underscore from 'vue-underscore'

// Vendor UI Framework
import Buefy from 'buefy'
// Don't need to import here, as setting overrides in App.vue
// import 'buefy/dist/buefy.css'
Vue.use(Buefy, {
    defaultIconPack: 'mdi',
    // defaultContainerElement: '#content',
})

Vue.config.productionTip = false

Vue.use(underscore);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
