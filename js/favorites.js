document.addEventListener("DOMContentLoaded", () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const likedMoviesList = document.getElementById("likedMoviesList");
  const resetButton = document.getElementById("resetButton");

  function createMovieCard(movieData) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const movieTitle = document.createElement("p");
    movieTitle.textContent = ` ${movieData.title}`;
    movieTitle.className = "movie-title";

    const moviePoster = document.createElement("img");
    moviePoster.src = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
    moviePoster.className="movie-Poster";
    moviePoster.alt = movieData.title;

    const heartIcon = document.createElement("i");
    const isLiked = likedMoviesArray.some((movie) => movie.id === movieData.id);
    heartIcon.className = `heart-icon ${
      isLiked ? "fa-solid" : "fa-regular"
    } fa-heart`;
    heartIcon.style.color = isLiked ? "#ff0000" : "";

    heartIcon.addEventListener("click", () => {
      const index = likedMoviesArray.findIndex(
        (movie) => movie.id === movieData.id
      );
      if (index !== -1) {
        likedMoviesArray.splice(index, 1);
      } else {
        likedMoviesArray.push(movieData);
      }
      updateLocalStorage();
      displayLikedMovies();
    });

    movieCard.appendChild(movieTitle);
    movieCard.appendChild(moviePoster);
    movieCard.appendChild(heartIcon);

    return movieCard;
  }

  function updateLocalStorage() {
    localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
  }

  function displayLikedMovies() {
    likedMoviesList.innerHTML = `<h2 class="favorite-Header">Liked Movies</h2>`;
    const movieCardContainer = document.createElement("div");
    movieCardContainer.className = "movie-card-container";

    likedMoviesArray.forEach((movieData) => {
      const movieCard = createMovieCard(movieData);
      movieCardContainer.appendChild(movieCard);
    });

    likedMoviesList.appendChild(movieCardContainer);
  }

  displayLikedMovies();

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("likedMovies");
    likedMoviesArray = [];
    updateLocalStorage();
    displayLikedMovies();
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
});
