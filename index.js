
//const

const imgPath = "https://image.tmdb.org/t/p/original";
const apikey = "1a80a0a05c62436764262bb290abcdce";
const apiEndpoint = "https://api.themoviedb.org/3";
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/movie/week?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyDktGuiY-d8197HyW5VvWRbxZ8Bofe3HvA`,
}

const yutube = "AIzaSyDktGuiY-d8197HyW5VvWRbxZ8Bofe3HvA";


//Boot up the app
function init() {
    fetchTrendingMovies();
    fetchAndBuildAllCategories();




}

function fetchTrendingMovies() {
    fetchAndbuildAllMovieSections(apiPaths.fetchTrending, 'Trending Now')
        .then(list => {

            const randomIndex = parseInt(Math.random() * list.length);

            buildBannerSection(list[randomIndex])
        }).catch(err => {
            console.log(err);
        });

}

//    Build banner section

function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');

    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;


    const div = document.createElement('div')

    div.className = "banner-content container";

    div.innerHTML = ` <p class="banner_title">${movie.title} </p>
    <p class="banner_info">Trending movie | release date ${movie.release_date}</p>
    <p class="banner_overview">${movie.overview.slice(0, 200)} </p>

    <div class="action-buttons-cont">
        <button class="action-button">Play</button>
        <button class="action-button">More info</button>
    </div>
    `


    bannerCont.append(div);



}

function fetchAndBuildAllCategories() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {

            const categories = res.genres
            if (Array.isArray(categories) && categories.length) {
                categories.slice(0, 1).forEach((category) => {

                    fetchAndbuildAllMovieSections(apiPaths.fetchMoviesList(category.id), category.name)
                })

            }
            // console.table(categories)


        })
        .catch(err => console.log(err))


}

function fetchAndbuildAllMovieSections(fetchUrl, categoryName) {
    // console.log(fetchUrl,categoryName)

    return fetch(fetchUrl).then(res => res.json()
    ).then(res => {

        // console.table(res.results);

        const movies = res.results;
        if (Array.isArray(movies) && movies.length) {

            buildMoviesSections(movies, categoryName);

        }
        return movies;
    })
        .catch(err => console.log(err))





}

function buildMoviesSections(list, categoryName) {

    // console.log(list , categoryName)

    const moviesCont = document.getElementById("movies-cont");

    const moviesListHTML = list.map(item => {
        return `
        <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')" >
        <img class="movie-item-img" src='${imgPath}${item.backdrop_path}' alt="${item.title}" >

        <div class="iframe-wrap" id="yt${item.id}"></div>

        </div>`
    }).join('');

    // console.log(moviesListHTML)

    const moviesSectionHTML = `
    <h2 class="movie-section-heading" >${categoryName} <span class="explore-nodge">Explore All</span></h2>
    
    <div class="movie-row">
      ${moviesListHTML}
     
    </div>
`

    // console.log(moviesSectionHTML)

    const div = document.createElement('div');

    div.className = 'movies-section';
    div.innerHTML = moviesSectionHTML;

    //append div to movies container

    moviesCont.append(div);



}

function searchMovieTrailer(movieName , iframId) {
    if (!movieName) return;


    console.log(document.getElementById(iframId),iframId);

    fetch(apiPaths.searchOnYoutube(movieName)).
        then(res => res.json()).
        then(res => {

            // console.log(res.items[0])
            const bestResult = res.items[0];
            const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
            console.log(youtubeUrl);
            // window.open(youtubeUrl, 'blank');

            const elements = document.getElementById(iframId);
            console.log(elements,iframId);

            const div = document.createElement('div');
            div.innerHTML = ` <iframe  width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`;


            elements.append(div)



        }

        ).catch(err => console.log(err));

}







window.addEventListener("load", function () {
    init();

    window.addEventListener('scroll', function () {
        const header = document.getElementById('header')

        if (window.scrollY > 5) header.classList.add('black-bg')

        else header.classList.remove('black-bg')
    })
})