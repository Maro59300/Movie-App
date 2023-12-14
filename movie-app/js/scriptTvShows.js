const APIURL =
    "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/tv?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById('tags');
const genres = [{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]


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
            getTvShows(APIURL + '&with_genres='+encodeURI(selectedGenre.join(',')))
        })
        tagsEl.append(t);
    })
}

// initially get fav movies
getTvShows(APIURL);


async function getTvShows(url) {
    lastUrl = url;
    const resp = await fetch(url);
    const respData = await resp.json();

    console.log(respData);

    totalPages = respData.total_pages;
    currentPage = respData.page;

    if (currentPage === 1) {
        main.innerHTML = ''; // Clear content only for the first page
    }

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