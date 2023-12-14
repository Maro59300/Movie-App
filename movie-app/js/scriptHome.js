const API_KEY = "api_key=1cf50e6248dc270629e802686245c2c8";
const BASE_URL = "https://api.themoviedb.org/3";
const APIURL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const APIURLTRENDING =
  "https://api.themoviedb.org/3/trending/all/day?&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const slideshowContainer = document.getElementById("slideshow-container");
const dotsContainer = document.getElementById("slideshow-dots");

// initially get fav movies
getMovies(APIURL);
getTrendings(APIURLTRENDING);

async function getTrendings(url) {
  const respTrending = await fetch(url);
  const respDataTrending = await respTrending.json();

  console.log(respDataTrending);

  createSlides(respDataTrending.results);
  showSlides(slideIndex);
}

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();

  console.log(respData);

  showMovies(respData.results);
}

function showMovies(movies) {
  // clear main
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { poster_path, title, vote_average, overview } = movie;

    const movieEl = document.createElement("div");
    movieEl.classList.add("media");

    movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="media-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                  vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                ${overview}
            </div>
        `;

    main.appendChild(movieEl);
  });
}

function createSlides(movies) {
  slideshowContainer.innerHTML = ""; // Clear existing slides
  dotsContainer.innerHTML = ""; // Clear existing dots
  const prev = document.createElement("a");

  prev.className = "prev";
  prev.onclick = () => plusSlides(-1);
  prev.innerHTML = "&#10094;";

  const next = document.createElement("a");

  next.className = "next";
  next.onclick = () => plusSlides(1);
  next.innerHTML = "&#10095;";

  movies.forEach((movie, index) => {
    // Create slide element
    const { poster_path, title, name, vote_average, overview, release_date ,original_language, media_type} = movie;

    if(media_type === "movie") {
        const slide = document.createElement("div");
        slide.className = "mySlides";
        slide.innerHTML = `
            
            <img src="${IMGPATH + poster_path}" alt="${title}" loading="lazy"/> 
            <div class="overview2">
                <h1>${title}</h1>
                <h2>Overview:</h2>   
                <h3>${overview}</h3>
                <h3>Released On: ${release_date}</h3>
                <h3>Orignal Language: ${original_language}</h3>
               
                <div class="overview-rate">
                    <span class="${getClassByRate(
                      vote_average
                    )}">${vote_average}</span>
                </div>
            </div>`;
    
        slideshowContainer.appendChild(slide);
        
    }else if(media_type === "tv"){
        const slide = document.createElement("div");
        slide.className = "mySlides";
        slide.innerHTML = `
            
            <img src="${IMGPATH + poster_path}" alt="${name}" loading="lazy" /> 
            <div class="overview2">
                <h1>${name}</h1>
                <h2>Overview:</h2>   
                <h3>${overview}</h3>
                <h3>Released On: ${release_date}</h3>
                <h3>Orignal Language: ${original_language}</h3>
               
                <div class="overview-rate">
                    <span class="${getClassByRate(
                      vote_average
                    )}">${vote_average}</span>
                </div>
            </div>`;
    
        slideshowContainer.appendChild(slide);
    }

    // Create dot element
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = function () {
      currentSlide(index + 1);
    };
    dotsContainer.appendChild(dot);
  });
  slideshowContainer.appendChild(prev);
  slideshowContainer.appendChild(next);
}

let slideIndex = 1;

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "flex";
  dots[slideIndex - 1].className += " active";
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

form.addEventListener("input", (e) => {
  const searchTerm = search.value;
  if (searchTerm) {
    getMovies(SEARCHAPI + searchTerm);
  }
});
