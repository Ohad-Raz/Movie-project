document.addEventListener('DOMContentLoaded', () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const movieTitle = document.getElementById('movieTitle');
  const dateAndRuntime = document.getElementById('dateAndRuntime');
  const movieGenre = document.getElementById('movieGenre');
  const movieCrew = document.getElementById('movieCrew');
  const movieCast = document.getElementById('movieCast');
  const MoviePoster = document.getElementById('MoviePoster');
  const searchIdButton = document.getElementById('searchIdButton');
  const searchByIdInput = document.getElementById('searchByIdInput');

  function createMovieCard(data) {
    const heartIconClass = isMovieLiked(data.id) ? 'fa-solid' : 'fa-regular';
  
    movieTitle.innerHTML =
      `<h3 > ${data.title} <i class="heart-icon ${heartIconClass} fa-heart" style="color: #ff0000;"></i></h3>`;
    dateAndRuntime.innerHTML =
      `<p >Date: ${data.release_date}</p>
       <p >Runtime: ${data.runtime} min</p>`;
  
    const heartIcon = movieTitle.querySelector('.heart-icon');
  
    heartIcon.addEventListener('click', () => {
      if (heartIcon.classList.contains('fa-regular')) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
        heartIcon.style.color = '#ff0000';
        likedMoviesArray.push(data);
      } else {
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');
  
        const index = likedMoviesArray.findIndex((movie) => movie.id === data.id);
        if (index !== -1) {
          likedMoviesArray.splice(index, 1);
        }
      }
  
      localStorage.setItem('likedMovies', JSON.stringify(likedMoviesArray));
    });
  
    const genreNames = data.genres.map((genre) => genre.name);
    movieGenre.innerHTML = `<h3>Genre: ${genreNames.join(", ")} <h3>`;
  
    let crewHtml = '';
  
    for (let i = 0; i < 10 && i < data.credits.crew.length; i++) {
      const crew = data.credits.crew[i];
      const crewNames = `${crew.job} : ${crew.name}`;
      crewHtml += (i > 0 ? ' , ' : '') + crewNames;
    }
    movieCrew.innerHTML = `<span>${crewHtml}</span>`;
  
    let castHtml = '';
  
    for (let i = 0; i < data.credits.cast.length; i++) {
      const cast = data.credits.cast[i];
      const characterName = cast.character;
      const actorName = cast.name;
      const profilePath = `https://image.tmdb.org/t/p/original${cast.profile_path}`;
  
      const imageTag = profilePath ? `<img src="${profilePath}" alt="${actorName}" >` : '';
  
      const slashIndex = characterName.indexOf('/');
  
      if (slashIndex !== -1) {
        const characters = characterName.substring(0, slashIndex);
        castHtml += (i > 0 ? '  ' : '') + `${imageTag}<div>
         ${characters} : ${actorName} </div></section>`;
      } else {
        castHtml += (i > 0 ? '  ' : '') + `<section>${imageTag} <div>
         ${characterName} : ${actorName} </div></section>`;
      }
  
      if (i >= 8) {
        break;
      }
    }
  
  
    movieCast.innerHTML += `<span>${castHtml}</span>`;
  
    MoviePoster.innerHTML =
      `<img  src="https://image.tmdb.org/t/p/original${data.poster_path}" />`;
  }

  function isMovieLiked(movieId) {
    return likedMoviesArray.some((movie) => movie.id === movieId);
  }

  searchIdButton.addEventListener('click', () => {
    const searchMovieVal = searchByIdInput.value;
    fetchMovies(searchMovieVal);
    staff.style.display = 'flex';
    MovieImgBox.style.display = 'flex';
  });

  function fetchMovies(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=f673b4c51255192622a586f74ec1f251&language=en-US&append_to_response=credits`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        createMovieCard(data);
        updateHeartIcons();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach((heartIcon) => {
      const movieTitleText = heartIcon.closest('p').textContent.split(':')[1].trim();
      if (likedMoviesArray.some((movie) => movie.title === movieTitleText)) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
        heartIcon.style.color = '#ff0000';
      }
    });
  }
});