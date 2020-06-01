import Vue from 'vue'
import App from './App.vue'
import axios from 'axios' //追記
import VueAxios from 'vue-axios' //追記

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.config.productionTip = false

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(VueAxios, axios) //追記

new Vue({
  render: h => h(App),
}).$mount('#app')



