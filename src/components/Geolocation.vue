<template>
  <div id="geolocation">
    <div>{{current_location}}</div>
    <button v-on:click="showNearBy()">Turn on Geolocation</button>
    <div id="map"></div>
    <button v-on:click="sorted = !sorted">Sort by {{sorted? 'name' : 'distance'}}</button>
    <ul class="list-of-atms" v-if="sorted" v-for="atm in listOfPlaces">{{atm.name}}</ul>
    <ul class="list-of-atms" v-if="!sorted" v-for="atm in listOfPlacesByName">{{atm.name}}</ul>
  </div>
</template>

<script>
export default {
  name: 'geolocation',
  data () {
    return {
      current_location: '',
      latitude: '43.3209',
      longitude: '21.8958',
      listOfPlaces: [],
      listOfPlacesByName: [],
      sorted: false,
    }
  },
  watch: {
    listOfPlaces: function(val) {
        var tmp=JSON.parse(JSON.stringify(this.listOfPlaces));
        this.listOfPlacesByName = tmp.sort(function(a, b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        })
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
        " Longitude: " + this.longitude;
        this.callGoogleApi();
    },

    showError: function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                this.current_location = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                this.current_location = "Location information is unavailable. We are usign default."+
                this.callGoogleApi();
                break;
            case error.TIMEOUT:
                this.current_location = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                this.current_location = "An unknown error occurred."
                break;
        }
    },
    
    callGoogleApi: function() {
        var map;
        var service;
        var infowindow;
        var _this = this;
        
        function initialize() {
            console.log('initialize');
          var pyrmont = new google.maps.LatLng(this.latitude,this.longitude);

          map = new google.maps.Map(document.getElementById('map'), {
              center: pyrmont,
              zoom: 15
            });

          var request = {
            location: pyrmont,
            //radius: '10000',
            type: ['atm'],
            rankBy: google.maps.places.RankBy.DISTANCE
          };

          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);
        }
        
        initialize.call(this);
        
        function callback(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              var place = results[i];
              console.log(place);
            }
            var topTen = results.slice(0, 10);
            _this.listOfPlaces = topTen;
            
          }
        }
    }
  } 
}
</script>
