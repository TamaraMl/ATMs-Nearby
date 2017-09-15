<template>
  <div id="geolocation">
    <div>{{current_location}}</div>
  </div>
</template>

<script>
export default {
  name: 'geolocation',
  data () {
    return {
      current_location: ''
    }
  },
  mounted () {
    this.showNearBy();
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
        this.current_location = "Latitude: " + position.coords.latitude + 
        "<br>Longitude: " + position.coords.longitude;
    },

    showError: function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                this.current_location = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                this.current_location = "Location information is unavailable."
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
