const APIURL =
    "https://api.themoviedb.org/3/trending/all/day?&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";


const main = document.getElementById("main");

let currentPage = 1;
let totalPages = 0;
let lastUrl = '';


getTrendings(APIURL);

async function getTrendings(url) {
    lastUrl = url;
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    totalPages = respData.total_pages;
    currentPage = respData.page;


    showTrendings(respData.results);
}

function loadNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        const nextUrl = `${APIURL}&page=${currentPage}`;
        getTrendings(nextUrl);
    }
}

function showTrendings(medias) { 
    medias.forEach((media) => {
        const { poster_path, title, name, vote_average, overview,media_type } = media;

        if (media_type === "movie") {

            const mediaEl = document.createElement("div");
            mediaEl.classList.add("media", "media-appear");

            mediaEl.innerHTML = `
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

            main.appendChild(mediaEl);

        }else if(media_type === "tv"){

            const mediaEl = document.createElement("div");
            mediaEl.classList.add("media" , "media-appear");

            mediaEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="media-info">
                <h3>${name}</h3>
                <span class="${getClassByRate(
                vote_average
            )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

            main.appendChild(mediaEl);

        }
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
        getTrendings(SEARCHAPI + searchTerm);
    } else {
        getTrendings(APIURL); // Load the initial content if search is cleared
    }
});