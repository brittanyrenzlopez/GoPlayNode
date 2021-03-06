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
   $(searchArtist).val('');
});
}

// Spotify build playlist
const app = {};
let userId = "";
let playlistId = "";
var url = window.location.href,
    token = url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];

// Artist search
app.getArists = (artist) => $.ajax({
  url: 'https://api.spotify.com/v1/search',
  method: 'GET',
  dataType: 'json',
  data: {
    type: 'artist',
    q: artist,
    access_token: token
  }
});

// Get Albums
app.getArtistAlbums = (artistId) => $.ajax({
  url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
  method: 'GET',
  dataType: 'json',
  data: {
    album_type: 'album',
    access_token: token
  }
});

// Get Tracks from Albums
app.getArtistTracks = (id) => $.ajax({
  url: `https://api.spotify.com/v1/albums/${id}/tracks`,
  method: 'GET',
  dataType: 'json',
  data: {
    access_token: token
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
app.getUsername = function(accessToken) {
  var url = 'https://api.spotify.com/v1/me';
  $.ajax(url, {
    dataType: 'json',
    headers: {
      'Authorization': 'Bearer ' + token
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
  var url = `https://api.spotify.com/v1/users/${userId}/playlists?access_token=${token}&content-type=application/json`
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
        
        const randomTracks = [];
        for(let i=0; i< 30; i++) {
          randomTracks.push(getRandomTrack(tracksResults));
        }
        let songs = randomTracks.join();
        app.addSongs(songs, playlistId);
    });
};
// add tracks to playlist
app.addSongs = function (songs, playlistId) {
  var url = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks?uris=${songs}&access_token=${token}&content-type=application/json`;
  console.log(userId);
  console.log(url);
  $.ajax(url, {
    dataType: 'json',
    method: 'POST',
    success: function(data) {
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
  var REDIRECT_URI = 'https://playdomain.herokuapp.com/';
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
   var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
  token = (hash.access_token);
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
    var loginButton = document.getElementById('btn-login');
    
    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
            getUsername(accessToken)
                .then(function(response) {
                    loginButton.style.display = 'none';
                });
            });
    });
};
$(listen);