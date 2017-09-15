<template>
  <div id="app">
    <hello></hello>
    <geolocation></geolocation>
  </div>
</template>

<script>
import Hello from './components/Hello.vue'
import Geolocation from './components/Geolocation.vue'

export default {
  name: 'app',
  components: {
    Hello,
    Geolocation
  }
}
</script>