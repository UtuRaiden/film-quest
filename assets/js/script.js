var searchAreaEl = document.querySelector('#searchArea')
var searchInputEl = document.querySelector('#searchInput')
var searchBtnEl = document.querySelector('#searchBtn')
var movieCards = document.getElementById('movie-cards')

//establish api key for watchmode

var MDB_BASE = 'https://api.themoviedb.org/3/search/movie?api_key=a1ad9f4fd19c47b55d47d59ffc20d5bc&query=';
var WM_START = 'https://api.watchmode.com/v1/title/movie-';
var WM_END = '/sources/?apiKey=XGdAAH7W3meP3wdEFoABmfraxujlvVnx0uycWvEl';

favList = []

searchAreaEl.addEventListener('click',function(event){
    var element = event.target
    if(element !== searchBtnEl)return
    var input = searchInputEl.value
    input = encodeURIComponent(input)
    var MDB_SEARCH = MDB_BASE + input
    getMovieResults(MDB_SEARCH)
})
//get user search
searchInputEl.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      var input = searchInputEl.value
      input = encodeURIComponent(input)
  
      var MDB_SEARCH = MDB_BASE + input
      getMovieResults(MDB_SEARCH)
    }
  })
  
movieCards.addEventListener('click',function(event){
    var isButton = event.target.nodeName === 'BUTTON'
    var element = event.target
    if(!isButton)return
    var favName = element.previousElementSibling.textContent;
    favSave(favName)
})
//Function to call the movie data from title using TMDB
function getMovieResults(Movie){
fetch(Movie)
    .then(function(res){
        if(!res.ok){throw new Error('Oops');};
        return res.json();
    })
    .then(function(data){
      
        // create movie cards after getting results
        createMovieCards(data.results)
    })
    .catch(function(error){
      
    })
}
// Function to create movie card results
async function createMovieCards(movies) {
    movieCards.textContent = ''
//loop for every result of the search
    for (entry of movies) {
        var movieCard = document.createElement('article')
        var moviePoster = document.createElement('img')

        if (entry.poster_path !== null) {
            moviePoster.setAttribute('src',`https://image.tmdb.org/t/p/original${entry.poster_path}`)
            movieCard.append(moviePoster)
        }

          
var titleId = entry.id;

var WMsearch = await fetch(WM_START+titleId+WM_END);
var WMdata = await WMsearch.json();

var uniqueSources = new Set();
const whereWatchLinks = [];


// function to show where to watch
for (var i = 0; i < WMdata.length; i++) {
  var sourceID = WMdata[i].source_id;
  if (!uniqueSources.has(sourceID)) {
    uniqueSources.add(sourceID);
    var whereWatchWord = document.createElement('p');
    whereWatchWord.classList.add('location'); 
    whereWatchLinks.push(WMdata[i].name);
    var list = document.createElement('ul');
    whereWatchLinks.forEach(function (link) {
        var listItem = document.createElement('li');
        listItem.textContent = link;
        list.appendChild(listItem);
    });
    whereWatchWord.appendChild(list);
   
  }
}
if (WMdata.length===0){
    var whereWatchWord=document.createElement('p');
    whereWatchWord.textContent = "Sorry this is unavailable"
}

        var movieTitle = document.createElement('h3')
        var movieYear = document.createElement('p')
        var favBtnEl = document.createElement('button')

        movieTitle.textContent = entry.original_title
        const releaseDate = new Date(entry.release_date);
        const month = releaseDate.getMonth() + 1;
        const day = releaseDate.getDate();
        const year = releaseDate.getFullYear();
        movieYear.textContent = `${month}/${day}/${year}`;
        
        favBtnEl.textContent = 'Add to list'
        
        movieCard.append(movieTitle,favBtnEl,movieYear,whereWatchWord)
        movieCards.appendChild(movieCard)
    }
}
//function that allows you to save a movie to your watch list
function favSave(movie){
    if(favList.includes(movie)) return
    favList.push(movie)
    localStorage.setItem('favList',JSON.stringify(favList))
}

function favInit(){
    var storedFav = JSON.parse(localStorage.getItem('favList'));
    if(storedFav !== null){
        favList = storedFav
    }
}

favInit()
