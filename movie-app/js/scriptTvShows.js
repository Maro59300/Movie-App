const APIURL =
    "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

let currentPage = 1;
let totalPages = 0;
let lastUrl = '';

// initially get fav movies
getTvShows(APIURL);


async function getTvShows(url) {
    lastUrl = url;
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    totalPages = respData.total_pages;
    currentPage = respData.page;


    showTvShows(respData.results);
}

function loadNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        const nextUrl = `${APIURL}&page=${currentPage}`;
        getTvShows(nextUrl);
    }
}

function showTvShows(shows) {
    shows.forEach((show) => {
        const { poster_path, name, vote_average, overview } = show;

        const showEl = document.createElement("div");
        showEl.classList.add("media", "media-appear"); // Add animation class here

        showEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${name}"
            />
            <div class="media-info">
                <h3>${name}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(showEl);
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
        getTvShows(SEARCHAPI + searchTerm);
    } else {
        getTvShows(APIURL); // Load the initial content if search is cleared
    }
});