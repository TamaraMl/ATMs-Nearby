<template>
  <div id="geolocation" v-bind:class="{mobile : !showList}">
    <div v-if="!showList" class="first-step-app vertical-align text-center">   
        <h2>{{ hello_msg }}</h2>
        <button class="btn btn-default" v-on:click="showNearBy()">Turn on Geolocation</button>
        <div>{{current_location}}</div>
    </div>
    <div v-if="showList" class="vertical-align second-step-app clearfix">
        <div class="col-md-6">
            <img v-bind:src="map_params" class="center-block map" alt="Google image">
        </div>
        <div  class="col-md-6">
            <div class="text-right">
                <button class="btn btn-default" v-on:click="sortByTelenor = !sortByTelenor"> {{sortByTelenor? 'All' : 'Multi-currency only'}}</button>
                <button class="btn btn-default" v-on:click="sorted = !sorted" v-bind:class="{disabled : sortByTelenor}" v-bind:disabled="sortByTelenor">Sort by {{sorted? 'name' : 'distance'}}</button>
            </div>
            <ul class="list-of-atms" v-if="sorted">
                <li v-for="atm in listOfPlaces">{{atm.name}}, {{atm.distance}}</li>
            </ul>
            <ul class="list-of-atms" v-if="!sorted">
                <li v-for="atm in listOfPlacesByName">{{atm.name}}, {{atm.distance}}</li>
            </ul>
        </div>
    </div>
    <div id="map" v-bind:class="{map : showList}" class="hidden"></div>
  </div>
</template>

<script>
function getAsUriParameters(data) {
   var url = '';
   for (var prop in data) {
      url += encodeURIComponent(prop) + '=' + 
          encodeURIComponent(data[prop]) + '&';
   }
   return url.substring(0, url.length - 1)
}

export default {
  name: 'geolocation',
  data () {
    return {
      hello_msg: "All ATM's on one place!",
      current_location: '',
      latitude: '43.3209',
      longitude: '21.8958',
      listOfPlaces: [],
      listOfPlacesByName: [],
      sorted: false,
      map: null,
      showList: false,
      sortByTelenor: false,
      map_base: "https://maps.googleapis.com/maps/api/staticmap?",
      map_api_key: "AIzaSyAg4SIOvB7AM1TZ6_BZQ6kafO-FAZ3bGSY",
      map_params: "https://maps.googleapis.com/maps/api/staticmap?"
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
    },
    sortByTelenor: function() {
        this.callGoogleApi();
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
        
    showPosition: function(position) {
        this.latitude =  position.coords.latitude;
        this.longitude =  position.coords.longitude;
        this.callGoogleApi();
    },

    showError: function(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                this.current_location = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                this.current_location = "Location information is unavailable. We are usign default.";
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
        this.showList = true;
        this.initialize();
    },
        
    initialize: function() {
        
      var my_location = new google.maps.LatLng(this.latitude,this.longitude);
    
      var map = new google.maps.Map(document.getElementById('map'), {
          center: my_location,
          zoom: 15
        });

      var request = {
        location: my_location,
        type: ['atm'],
        rankBy: google.maps.places.RankBy.DISTANCE
      };

      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, this.callbackPlaces); 
    },

    callbackPlaces: function (results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var topTen;
        if(this.sortByTelenor) {
            var onlyTelenor = results.filter(function(el) {
                return el.name = "Telenor Banka ATM";
            });
            topTen = onlyTelenor.slice(0, 10);
        } else {
            topTen = results.slice(0, 10);
        }
        
        this.listOfPlaces = topTen;
        var paramsForStatic = {
            center: this.latitude+','+this.longitude,
            size: '500x325',
            key: this.map_api_key,
            zoom: 15,
            markers:""
        }
        
        for (let i = 0; i < topTen.length; i++) {
            paramsForStatic.markers+=topTen[i].vicinity+"|";
        }
        
        this.map_params = this.map_base + getAsUriParameters(paramsForStatic);

      }
      this.getDistances();
    },
    
    getDistances: function() {
        var service2 = new google.maps.DistanceMatrixService();
        var origin = {lat:this.latitude,lng:this.longitude};

        var topTen = this.listOfPlaces;
        var _this=this;
        var amp_destinations = topTen.map(function(el) { return el.vicinity});

        service2.getDistanceMatrix({
          origins: [origin],
          destinations: amp_destinations,
          travelMode: google.maps.TravelMode.WALKING,
          avoidTolls: false
        }, function(response, status) {
            for (let i = 0; i < topTen.length; i++) {
                topTen[i].distance = response.rows[0].elements[i].distance.text;
            }
            _this.listOfPlaces=JSON.parse(JSON.stringify(_this.listOfPlaces));
        });
    }
    } 
  
}
</script>