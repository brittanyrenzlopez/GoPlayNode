const songkickURL = "https://api.songkick.com/api/3.0/events.json?apikey=Lpl57W3wcb5NEdNk";
var concertInfo = [];

// Get Top Artists to display on front page
function getTopArtistsfromLastFM(callback) {
  let URL = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=393f6ffbf12f2269f84b5b7240397dbc&format=json`;

  $.getJSON(URL, callback);
}

function displayTopArtistsfromLastFM(data) {
  console.log(data, "display top artists");      //$.each(data.artists.artist, function(i, element){
      for(var i = 0; i <= 10; i++) {
      let popName = data.artists.artist[i].name;
      $("#popularArtists").append("<li style='list-style-type: none; display:block; margin: 10px 0;'><a onclick='topArtistListen();' class='topID'>" + popName +"</a></li>");
    };

};


// Get Artist Bio
function getBiofromLastFM(searchArtist, callback) {
  console.log('LASTFM function');
  let URL = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${searchArtist}&api_key=393f6ffbf12f2269f84b5b7240397dbc&format=json`;

  $.getJSON(URL, callback);
  console.log(URL);
}

function displayBioFromLastFM(data) {
  $("#artistBio").html(`<p>${data.artist.bio.summary}</p>`);
}


// Get Similar Artists
function getSimilarArtists(searchArtist, callback) {
  let URL = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${searchArtist}&api_key=393f6ffbf12f2269f84b5b7240397dbc&format=json`;

  $.getJSON(URL, callback);
  console.log("similar artists");
}

function displaySimilarArtists(data) {
  console.log(data, "display top artists");
      //$.each(data.artists.artist, function(i, element){
      for(var i = 0; i <= 10; i++) {
      let simName = data.similarartists.artist[i].name;
      $("#similar").append("<li style='list-style-type: none;'><a>" + simName +"</a></li>");
    };

};

// AJAX call to Songkick
function getDataFromSongkickApi(searchArtist, callback) {
  console.info("Inside SongkickAPI function");
 
  const settings = {
    url: songkickURL,
    dataType: "json",
    type: "GET",
    data: {
      artist_name: searchArtist
    },
    success: function (data){ 
       let eventInfo = data.resultsPage.totalEntries;
   console.log(data);
   if (eventInfo == 0) {
    $("#concert-cont").append('<h1 id="upcoming" style="color:whitesmoke">No Upcoming Events</h1>')
   }

   $.each(data["resultsPage"]["results"]["event"], function(i, entry){
        $("#concert-cont").append('<li style="list-style-type: none;"><a target="_blank" href="' + entry.uri+'">'+entry.displayName +'</a></li>');
    })},
    timeout: 5000,
    error: function() {
      alert('Error retrieving data');
    }
  };
  $.ajax(settings);
};

// callback function
function displaySongkickData(data) {

  const songkickData = data.resultsPage.results.event;
  const searchArtist = $('.search').val();

;
  if (songkickData != undefined) {
    const results = songkickData.map((item, index) => renderConcertResults(item));
    $('.js-search-results').html(results); // Stores Songkick data in global variable, concertInfo
    concertInfo = songkickData.map((item, index) => {
    console.log(item);
      return item;

    });
    $('#concert-cont').show();
    location.href = "#results";
  }
}

// renders results to page
function renderConcertResults(result) {
  return `
   <div class="result-container" role="contentinfo">
     <h3 class="render-text"><a href="${result.uri}" target="_blank">${result.displayName}</a></h3>
     <h4 class="render-text">${result.start.date}</h4>
     <p class="render-text"><strong>${result.venue.displayName}</strong>, ${result.location.city}</p>
   </div>
 `;
}

// close out display
function lose() {
  document.getElementById('container').style.display="none";
  document.getElementById('goPlay').style.display="";
  document.getElementById('searching').style.display="";
  document.getElementById('search-btn').style.display="";
  document.getElementById('footer').style.display="";
  document.getElementById('popularArtists').style.display="";
  document.getElementById('topTen').style.display="";
  var music = document.querySelector('audio');


  $('#concert-cont').empty();
  $('.search').val('');

};


// listen for when user enters input to search for artist
function listen(){
$(`#search-btn`).click(event =>{
  event.preventDefault();
  var searchArtist = $('.search').val();
  var userText = $(`.search-form`).find(`.search`);
   if($('.search').val() == ''){
      alert('You did not enter an artist');
      return false;
   } else {
  document.getElementById('container').style.display="";
  document.getElementById('goPlay').style.display="none";
  document.getElementById('searching').style.display="none";
  document.getElementById('search-btn').style.display="none";
  document.getElementById('footer').style.display="none";
  document.getElementById('popularArtists').style.display="none";

   }
  $(`#artistName`).html(`${userText.val()}`);
  getDataFromSongkickApi(searchArtist, displaySongkickData);
  getBiofromLastFM(searchArtist, displayBioFromLastFM);
  getSimilarArtists(searchArtist, displaySimilarArtists);
});
}

function topArtistListen(){
const searchArtist = $('.topID').text();
console.log(searchArtist);
$('.topID').click(function(){
   $(`artistName`).html($(this).val());
  document.getElementById('container').style.display="";
  document.getElementById('goPlay').style.display="none";
  document.getElementById('searching').style.display="none";
  document.getElementById('search-btn').style.display="none";
  document.getElementById('footer').style.display="none";
  document.getElementById('popularArtists').style.display="none";
  getDataFromSongkickApi(searchArtist, displaySongkickData);
  getBiofromLastFM(searchArtist, displayBioFromLastFM);
});
}



// element store
let form = document.querySelector(".search-form");
let resultShow = document.querySelector("#tracks");
let button = document.querySelector("#search-btn");
let input = document.querySelector(".search");
let audio = document.querySelector("audio");

//button event to get user input
button.addEventListener("click", function(event) {
    event.preventDefault();

    let searchText = document.querySelector(".search").value;

    resultShow.textContent = "";
// fetch request called after button event
fetch(`https://itunes.apple.com/search?term=${searchText}`)  
.then (function (data){
    return data.json();
})
.then (function(json) {   

    for (var i = 0; i < 4; i++) {
        let name = json.results[i].artistName;
        let songName = json.results[i].trackName;
        let audio2 = json.results[i].previewUrl;
// append results to page
        let show = `
        <div class = "topTracks" role ="contentinfo">
            <h3 style="color:whitesmoke;"> ${songName} </h3>
            <audio controls class = "play">
            <source value="" src="${audio2}" type="audio/mpeg">
        </div>
        `;
        resultShow.insertAdjacentHTML("beforeEnd", show);
    }
});
});

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

const app = {};

// Allow user to enter names

app.events = function() {
  $('#search-btn').on('click', function(e){
    e.preventDefault();
    let artists = $('input[type=text]').val();
    console.log(artists);
  });
};

// Go to Spotify and get artist

// IDs to get albums

// Get tracks

// Build playlist

app.init = function () {
  app.events();
};



$(app.init);

function SpotifyLogin() {
    
    function login(callback) {
        var CLIENT_ID = '812eeebca2a145988f7f5099e1761808';
        var REDIRECT_URI = 'http://localhost:7000/';
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL([
            'user-read-email'
        ]);
        
        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);
    
        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);
        
        var w = window.open(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );
        
    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    var templateSource = document.getElementById('result-template').innerHTML,
        resultsPlaceholder = document.getElementById('result'),
        loginButton = document.getElementById('btn-login');
    
    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    loginButton.style.display = 'none';
                    resultsPlaceholder.innerHTML = template(response);
                });
            });
    });
    
};

$(getTopArtistsfromLastFM(displayTopArtistsfromLastFM));


$(listen);

$(topArtistListen());
