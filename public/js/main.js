//Spotify Client ID: 812eeebca2a145988f7f5099e1761808
//Spotify Client Secret: 04cc698bfb7b4e7ab14ec5600cac73a2



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
  var userText = $('input[type=text]').val();
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
  $(`#artistName`).html(`${userText}`);
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

// When user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

const app = {};

app.apiUrl = "https://api.spotify.com/v1";

// Allow user to enter names

app.events = function() {
  $('#search-btn').on('click', function(e){
    e.preventDefault();
    let artists = $('input[type=text]').val();
    console.log(artists);

    //let artistSplit = artists.split(',');
    //let look = artistSplit.map(artistName => app.artistSearch(artistName));


    app.retreiveArtistInfo(artists);


  });
};

// Go to Spotify and get artist
app.artistSearch = (artistName) => $.ajax({
  url: `${app.apiUrl}/search`,
  method:'GET',
  dataType: 'json',
  data: {
    q: artistName,
    type: 'artist',
    access_token: "BQAJmEA1xlbSST_K3A20Ju2QM3hD82H9bILw0ODpyoxZ6yGtPyzLirph9r291Nz_KEdP6dtH-l58PLOxo1wS6HMTRfgQKEBnUDtcxGViLCaZ_jLVJm7ReHpFg_PKqw48t0l9kdPw6bLqNRFLsrt57q3_wvMtzw"
  }
});

// IDs to get albums
app.getArtistAlbums = (artistId) => $.ajax({
  url: `{app.apiUrl}/artists/${id}/albums`,
  method: 'GET',
  dataType: 'json',
  data: {
    album_type: 'album'
  }
});

// Get tracks
app.getArtistTracks = (id) => $.ajax({
  url: `${app.apiUrl}/albums/${id}/tracks`,
  method: 'GET',
  dataType: 'json',

});


// Build playlist

app.buildPlayList = function(tracks){
  $.when(...tracks)
    .then((...tracksResults) => {
      tracksResults = tracksResults.map(getFirstElement)
        .map(item => item.items)
        .reduce(flatten,[])
        .map(item => item.id);

        const randomTracks = [];

        for(let i=0; i <30; i++) {
          randomTracks.push(getRandomTrack(tracksResults));
        }

        const baseUrl = `https://embed.spotify.com/?theme=white&uri=spotify:trackset:My Playlist:${randomTracks.join()}`;
        songs = songs.map(song => song.id).join(',');


        $('.playlist').html(`<iframe src="${baseUrl}" height="400"></iframe>`);
  });

};

app.init = function () {
  app.events();
};


//
app.retreiveArtistInfo = function(artists) {
    $.when(...artists)
      .then((...results) => {
  
          let finalResults = results.map(getFirstElement)
            //.map(res => res.artists.items[0].id)
            //.map(id => app.getArtistAlbums(id));
            console.log(finalResults);
          
          app.retreiveArtistTracks(finalResults);

      });
};

app.retreiveArtistTracks = function(artistAlbums) {
  $.when(...artistAlbums)
    .then((...albums) => {
      albumIds = albums.map(getFirstElement)
        .map(res => res.items)
        .reduce(flatten, [])
        .map(album => album.id)
        .map(ids => app.getArtistTracks(ids));
      app.buildPlayList(albumIds);

        
    });
}

const getFirstElement = (item) => item[0];

const flatten = (prev,curr) => [...prev,...curr];

const getRandomTrack = (trackArray) => {
  const randoNum = Math.floor(Math.random() * trackArray.length);
  return trackArray[randoNum];
}


$(app.init);

// Log in to Spotify

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

        console.log(url);
        
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
        
        var w = window.location.assign(url,
                            'Spotify',
                            'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                           );
        console.log(url);
        
    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }
   
    var resultsPlaceholder = document.getElementById('result'),
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
