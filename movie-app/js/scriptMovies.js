const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const APIURL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById('tags');

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

let currentPage = 1;
let totalPages = 0;
let lastUrl = '';

var selectedGenre = []

setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('option');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
                t.classList.add('selected');
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                            t.classList.remove('selected');
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                    t.classList.add('selected');
                }
            }
            console.log(selectedGenre)
            getMovies(APIURL + '&with_genres='+encodeURI(selectedGenre.join(',')))
        })
        tagsEl.append(t);
    })
}




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

