const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const APIURL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI ="https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");



let currentPage = 1;
let totalPages = 0;
let lastUrl = '';


// initially get fav movies
getMovies(APIURL);

async function getMovies(url) {
    lastUrl = url;
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    totalPages = respData.total_pages;
    currentPage = respData.page;

    if (currentPage === 1) {
        main.innerHTML = ''; // Clear content only for the first page
    }

    showMovies(respData.results);
}

function loadNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        const nextUrl = `${APIURL}&page=${currentPage}`;
        getMovies(nextUrl);
    }
}

function showMovies(movies) {
    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("media", "media-appear"); // Add animation class here

        movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="media-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(movieEl);
    });
}
function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 350) {
        // Load next page
        loadNextPage();
    }
});

form.addEventListener("input", (e) => {
    

    const searchTerm = search.value;
  

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);

    }
});

