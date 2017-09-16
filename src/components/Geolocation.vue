<template>
  <div id="geolocation">
    <div>{{current_location}}</div>
    <button v-on:click="showNearBy()">Turn on Geolocation</button>
  </div>
</template>

<script>
export default {
  name: 'geolocation',
  data () {
    return {
      current_location: '',
      latitude: '43.3209',
      longitude: '21.8958'
    }
  },
  methods: {
    showNearBy: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( this.showPosition, this.showError);
        } else { 
            this.current_location = "Geolocation is not supported by this browser.";
        }
    },
        
    showPosition:function(position) {
        this.latitude =  position.coords.latitude;
        this.longitude =  position.coords.longitude;
        this.current_location = "Latitude: " + this.latitude + 
        "<br>Longitude: " + this.longitude;
    },

    showError: function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                this.current_location = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                this.current_location = "Location information is unavailable. We are usign default.. </br>"+
                "Latitude: " + this.latitude +
                "<br>Longitude: " + this.longitude;
                break;
            case error.TIMEOUT:
                this.current_location = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                this.current_location = "An unknown error occurred."
                break;
        }
    }    
  } 
}
</script>
