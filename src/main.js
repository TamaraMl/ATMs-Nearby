// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
// main.js
var Vue = require('vue')
var App = require('./App.vue')

new Vue({
  el: '#app',
  render: function (createElement) {
    return createElement(App)
  }
})
