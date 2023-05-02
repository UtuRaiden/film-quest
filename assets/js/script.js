var searchAreaEl = document.querySelector('#searchArea')
var searchInputEl = document.querySelector('#searchInput')
var searchBtnEl = document.querySelector('#searchBtn')
var movieCards = document.getElementById('movie-cards')

var MDB_BASE = 'https://api.themoviedb.org/3/search/movie?api_key=a1ad9f4fd19c47b55d47d59ffc20d5bc&query='

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

movieCards.addEventListener('click',function(event){
    var isButton = event.target.nodeName === 'BUTTON'
    var element = event.target
    if(!isButton)return
    var favName = element.previousElementSibling.textContent;
    favSave(favName)
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

function createMovieCards(movies) {
    movieCards.textContent = ''

    for (entry of movies) {
        var movieCard = document.createElement('article')
        var moviePoster = document.createElement('img')

        if (entry.poster_path !== null) {
            moviePoster.setAttribute('src',`https://image.tmdb.org/t/p/original${entry.poster_path}`)
            movieCard.append(moviePoster)
        }

        var movieTitle = document.createElement('h3')
        var movieYear = document.createElement('p')
        var favBtnEl = document.createElement('button')

        movieTitle.textContent = entry.original_title
        movieYear.textContent = new Date(entry.release_date).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})
        favBtnEl.textContent = 'Add to list'
        
        // wrap elements in container div
        var container = document.createElement('div')
        container.append(moviePoster, movieTitle, movieYear, favBtnEl)

        // apply CSS styling to container div
        container.style.display = 'flex'
        container.style.flexDirection = 'column'
        container.style.justifyContent = 'space-between'
        container.style.height = '100%'

        // append container div to movieCards element
        movieCards.appendChild(movieCard)
        movieCard.appendChild(container)
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