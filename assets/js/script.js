var searchAreaEl = document.querySelector('#searchArea')
var searchInputEl = document.querySelector('#searchInput')
var searchBtnEl = document.querySelector('#searchBtn')
var movieCards = document.getElementById('movie-cards')

var MDB_BASE = 'https://api.themoviedb.org/3/search/movie?api_key=a1ad9f4fd19c47b55d47d59ffc20d5bc&query=';
var WM_START = 'https://api.watchmode.com/v1/title/movie-';
var WM_END = '/sources/?apiKey=XGdAAH7W3meP3wdEFoABmfraxujlvVnx0uycWvEl';

favList = []

searchAreaEl.addEventListener('click',function(event){
    var element = event.target
    if(element !== searchBtnEl)return
    var input = searchInputEl.value
    input = encodeURIComponent(input)
    console.log(input)
    var MDB_SEARCH = MDB_BASE + input
    getMovieResults(MDB_SEARCH)
})

searchInputEl.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      var input = searchInputEl.value
      input = encodeURIComponent(input)
      console.log(input)
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





function getMovieResults(Movie){
fetch(Movie)
    .then(function(res){
        if(!res.ok){throw new Error('Oops');};
        return res.json();
    })
    .then(function(data){
        console.log(data);
        // create movie cards after getting results
        createMovieCards(data.results)
    })
    .catch(function(error){
        console.error(error)
    })
}
// Function to create movie card results
async function createMovieCards(movies) {
    movieCards.textContent = ''

    for (entry of movies) {
        var movieCard = document.createElement('article')
        var moviePoster = document.createElement('img')

        if (entry.poster_path !== null) {
            moviePoster.setAttribute('src',`https://image.tmdb.org/t/p/original${entry.poster_path}`)
            movieCard.append(moviePoster)
        }
      
        var titleId = entry.id;
        console.log(titleId);
        var WMsearch = await fetch(WM_START+titleId+WM_END);
        var WMdata = await WMsearch.json();
        console.log(WMdata);
        var i =0;
        var length = WMdata.length -1;
        console.log(length);   
        var sourceCheck = 0;    
        const whereWatchLink = []
        if (length<0){
            var whereWatchWord = document.createElement('p');
            whereWatchWord.textContent ="Sorry this is unavailable"
        }    
            while(i < length + 1){
            var sourceID = WMdata[i].source_id
            var whereWatchWord = document.createElement('p');

    
            if (sourceID != sourceCheck){
                whereWatchLink.push(WMdata[i].name)
                sourceCheck = sourceID
                whereWatchWord.append(whereWatchLink)
                console.log(whereWatchWord)
            }
            console.log(i);
            i++;
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