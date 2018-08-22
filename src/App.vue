<template>
  <div id="app" class="container">
    <geolocation></geolocation>
  </div>
</template>

<script>

import Geolocation from './components/Geolocation.vue'
import Loader from './components/Loader.vue'

export default {
  name: 'app',
  components: {
    Geolocation,
      Loader
  }
}
</script>