var searchAreaEl = document.querySelector('#searchArea')
var searchInputEl = document.querySelector('#searchInput')
var searchBtnEl = document.querySelector('#searchBtn')

var MDB_BASE = 'https://api.themoviedb.org/3/search/movie?api_key=a1ad9f4fd19c47b55d47d59ffc20d5bc&query='

searchAreaEl.addEventListener('click',function(event){
    var element = event.target
    if(element !== searchBtnEl)return
    var input = searchInputEl.value
    input = encodeURIComponent(input)
    console.log(input)
    var MDB_SEARCH = MDB_BASE + input
    getMovieResults(MDB_SEARCH)
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
function createMovieCards(movies) {
    var movieCards = document.getElementById('movie-cards')

    for (entry of movies) {
        var movieCard = document.createElement('article')
        var moviePoster = document.createElement('img')

        if (entry.poster_path !== null) {
            moviePoster.setAttribute('src',`https://image.tmdb.org/t/p/original${entry.poster_path}`)
            movieCard.append(moviePoster)
        }

        var movieTitle = document.createElement('p')
        var movieYear = document.createElement('p')

        movieTitle.textContent = entry.original_title
        movieYear.textContent = entry.release_date
        
        
        movieCard.append(movieTitle, movieYear)
        movieCards.appendChild(movieCard)
    }
}
