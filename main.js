// LASTFM: 393f6ffbf12f2269f84b5b7240397dbc
// Genius: client secret pRXtcWKwZOPy7Mg-Ys81ttaeifWoOqQ1Y_ZqNsQhfqeW5SBguJ8F3qAU84ZNd1OIcopNHMZgekpPIkeAnSH_Sg
// Genius client id WeI3R_rkfZQlSvNi2Qmee8dFRRFvZtu-PgLcFbnPqomBbpVKOfrccakzsjmrwwAg
// Genius client access token t5gFCfFhOstTCio_v48kUJYqajqXVczv91YGQvWiR_4RgsJBpD-eOtV8gEjYqqD4



const songkickURL = "https://api.songkick.com/api/3.0/events.json?apikey=Lpl57W3wcb5NEdNk";
var concertInfo = [];

function getTopArtistsfromLastFM(callback) {
  let URL = `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=393f6ffbf12f2269f84b5b7240397dbc&format=json`;

  $.getJSON(URL, callback);
  console.log("top artists");
}

function displayTopArtistsfromLastFM(data) {
  console.log(data, "display top artists");
      //$.each(data.artists.artist, function(i, element){
      for(var i = 0; i <= 10; i++) {
      let popName = data.artists.artist[i].name;
      $("#popularArtists").append("<li><a>" + popName +"</a></li>");
    };

};

function getBiofromLastFM(searchArtist, callback) {
  console.log('LASTFM function');
  let URL = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${searchArtist}&api_key=393f6ffbf12f2269f84b5b7240397dbc&format=json`;

  $.getJSON(URL, callback);
  console.log(URL);
}

function displayBioFromLastFM(data) {
  console.log(data, 'data');
  $("#artistBio").html(`<p>${data.artist.bio.summary}</p>`);
}


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
        $("#concert-cont").append('<li><a href="' + entry.uri+'">'+entry.displayName +'</a></li>');
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
  var music = document.querySelector('audio');


	$('#concert-cont').empty();
	$('.search').val('');

};


// listen for when user enters input to search for artist
function listen(){
$(`#search-btn`).click(event =>{
	event.preventDefault();
	const searchArtist = $('.search').val();
 	const userText = $(`.search-form`).find(`.search`);
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

    for (var i = 0; i < 2; i++) {
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

$(getTopArtistsfromLastFM(displayTopArtistsfromLastFM));
$(listen);