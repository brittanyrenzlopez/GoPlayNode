//Spotify Client ID: 812eeebca2a145988f7f5099e1761808
//Spotify Client Secret: 04cc698bfb7b4e7ab14ec5600cac73a2

// Get Top Artists to display on front page
function getTopArtistsfromLastFM(callback) {
  let URL = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=393f6ffbf12f2269f84b5b7240397dbc&format=json`;
  $.getJSON(URL, callback);
}
function displayTopArtistsfromLastFM(data) {
  console.log(data, "display top artists");
      for(var i = 0; i <= 10; i++) {
      let popName = data.artists.artist[i].name;
      $("#popularArtists").append("<li style='list-style-type: none; display:block; margin: 10px 0;'><a onclick='topArtistListen();' class='topID'>" + popName +"</a></li>");
    };
};

// close out content display
function lose() {
  document.getElementById('container').style.display="none";
  document.getElementById('searching').style.display="";
  document.getElementById('search-btn').style.display="";
  document.getElementById('popularArtists').style.display="";
  document.getElementById('topTen').style.display="";
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
  document.getElementById('search-btn').style.display="";
  document.getElementById('footer').style.display="none";
  document.getElementById('popularArtists').style.display="none";
   }
});
}

// Spotify build playlist
const app = {};
let userId = "";
let playlistId = "";
let token = "";
let access = "BQC62tCxNW0mBqNY-VgSOPGHnJBmFWnB_M16aKLr6LICenq7PufNVFo9PSPqLMPxa16PZKeY2aUEf-lf_XAFAPYkoRIHRqik1sEfIY5OaLoQO0yPt_kIRdv1d0uPVgxrH9lAiwxGaEnYIPL1idwbJx-9PbFxko1r8N0PA9hQeMtlnYnSrzlXFD6EvUzSs5SnRnlKUXROu8YUAMsKxU6i5jPkFXN4FuC11lM3dQ";

app.getArists = (artist) => $.ajax({
  url: 'https://api.spotify.com/v1/search',
  method: 'GET',
  dataType: 'json',
  data: {
    type: 'artist',
    q: artist,
    access_token: access
  }
});


// Get Albums
app.getArtistAlbums = (artistId) => $.ajax({
  url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
  method: 'GET',
  dataType: 'json',
  data: {
    album_type: 'album',
    access_token: hash.access_token
  }
});

// Get Tracks from Albums
app.getArtistTracks = (id) => $.ajax({
  url: `https://api.spotify.com/v1/albums/${id}/tracks`,
  method: 'GET',
  dataType: 'json',
  data: {
    access_token: access
  }
});

// Gets albums from artists
app.retreiveArtistInfo = function(look) {
    // spreads array
    $.when(...look)
      .then((...results) => {
        // most relevant match
        results = results.map(getFirstElement)
        .map((res) => res.artists.items[0].id)
        .map(id => app.getArtistAlbums(id));

        app.retreiveArtistTracks(results);
        //results are JSON of albums from artists, pass to rtracks
      });
};
// get Spotify user
app.getUsername = function(id) {
  var url = 'https://api.spotify.com/v1/me';
  let accesstoken = access
  $.ajax(url, {
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + accesstoken
    },
    success: function(data) {
      userId = (data.id);
      console.log(userId);
      app.createPlaylist(userId);
    }
  });
}

// Create empty playlist
app.createPlaylist = function(userId) {
  var url = `https://api.spotify.com/v1/users/${userId}/playlists?access_token=${access}&content-type=application/json`
  console.log(userId, url);
  $.ajax(url, {
    dataType: 'json',
    method: 'POST',
    data: JSON.stringify({
      'name': 'Play Domain',
      'public': 'false'
    }),
    success: function(data) {
      console.log(data);
      playlistId = (data.id);
      console.log(playlistId);
    }
  });
}

// Gets albums and tracks
app.retreiveArtistTracks = function(artistAlbums) {
  $.when(...artistAlbums)
  .then((...albums) => {
    albumIds = albums.map(getFirstElement)
      .map(res => res.items)
      //flatten and concat arrays
      .reduce(flatten,[])
      .map(album => album.id)
      .map(ids => app.getArtistTracks(ids));
    app.buldPlayList(albumIds);
    // albums
    console.log(albumIds, "album Id");
  });
};
//get tracks for playlist
app.buldPlayList = function(albumsIds) {
  $.when(...albumIds)
    .then((...tracksResults) => {
      // tracksResults are all artist songs
      tracksResults = tracksResults.map(getFirstElement)
        .map(item => item.items)
        .reduce(flatten,[])
        .map(item => item.uri);

        console.log(playlistId);
        
        const randomTracks = [];
        for(let i=0; i< 30; i++) {
          randomTracks.push(getRandomTrack(tracksResults));
        }

        let songs = randomTracks.join();
        app.addSongs(songs, playlistId);
        console.log(songs);

    });
};
// add tracks to playlist
app.addSongs = function (songs, playlistId) {
  var url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?uris=${songs}&access_token=${access}&content-type=application/json`;
  console.log(userId);
  console.log(url);
  $.ajax(url, {
    dataType: 'json',
    method: 'POST',
    success: function(data) {
      console.log(data);
      $('.playlist').html(`<iframe src="https://open.spotify.com/embed?uri=spotify:user:${userId}:playlist:${playlistId}&theme=white&view=coverart" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`);
    }
  })
}

// reusable function that returns first element
const getFirstElement = (item) => item[0];

const flatten = (prev, curr) => [...prev,...curr];

// take track array
const getRandomTrack = (trackArray) => {
  const randoNum = Math.floor(Math.random() * trackArray.length);
  return trackArray[randoNum];
}


// Allow user to enter artist names
app.events = function() {
  $('#search-btn').on('click', function(e) {
    e.preventDefault();
    let artists = $('input[type=text]').val();
    console.log(artists);
    $('.loader').addClass('show');
    // create array
    artists = artists.split(',');
    // create array of calls
    let look = artists.map(artist => app.getArists(artist));   
    // pass look
    app.retreiveArtistInfo(look);
    app.getUsername();
      });
  };

app.init = function() {
  app.events();
};

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
      'user-read-email user-read-private user-read-birthdate playlist-modify-public playlist-modify-private'
]);
        console.log(url);
        
  var width = 450,
      height = 730,
      left = (screen.width / 2) - (width / 2),
      top = (screen.height / 2) - (height / 2);   
      window.addEventListener("message", function(event) {
   hash = JSON.parse(event.data);
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