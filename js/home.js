document.addEventListener('DOMContentLoaded', () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const moviesPresentation = document.getElementById('moviesPresentation');
  const dailyId = document.getElementById('dailyId');
  const weeklyId = document.getElementById('weeklyId');
  const pagination = document.querySelector('.pagination');
  let currentPage = 1;
  let popularity = 'day';
  

  function fetchMovies(page = 1, popularity = 'day') {
    let url;

    if (popularity === 'day') {
      url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=f673b4c51255192622a586f74ec1f251`;
    } else if (popularity === 'week') {
      if (page >= 1 && page <= 5) {
        const startPage = page + 9;
        url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${startPage}&api_key=f673b4c51255192622a586f74ec1f251`;
      } else {
        console.log('nope');
        return;
      }
    }

    
/*check*/
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log(data);
    //     moviesPresentation.innerHTML = '';
    //     data.results.forEach((movieResult) => {
    //       moviesPresentation.innerHTML += ` 
    //         <p id="titleAndHeart">title:${movieResult.title}<i class="heart-icon fa-regular fa-heart" style="color: #ff0000;"></i></p>
    //         <img style="width: 20%; height: auto;" src="https://image.tmdb.org/t/p/original${movieResult.poster_path}" />
       
    //         `;
    //     });
        
  //   fetch(url)
  // .then((res) => res.json())
  // .then((data) => {
  //   console.log(data);
  //   moviesPresentation.innerHTML = '';
  //   data.results.forEach((movieResult) => {
  //     moviesPresentation.innerHTML += `
  //       <p id="titleAndHeart">title:${movieResult.title}<i class="heart-icon fa-regular fa-heart" style="color: #ff0000;"></i></p>
  //       <img style="width: 20%; height: auto;" src="https://image.tmdb.org/t/p/original${movieResult.poster_path}" />
  //     `;
  //   });
  // });
/*check end*/

        fetch(url)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          moviesPresentation.innerHTML = '';
          data.results.forEach((movieResult) => {
            moviesPresentation.innerHTML += `
            <div class="movie-container">
             
              <img id="movieImg"  src="https://image.tmdb.org/t/p/original${movieResult.poster_path}" />
              <p id="titleAndHeart"><small id="smallTitle"></small> <b>${movieResult.title}<b><i class="heart-icon fa-regular fa-heart" style="color: #ff0000;"></i></p>
            </div>
          `;
          });
  

        


        // moviesPresentation.addEventListener('click', (event) => {
        //   const target = event.target;
        //   const heartIcon = target.tagName === 'I' && target.classList.contains('fa-heart')
        //     ? target
        //     : target.closest('i.fa-heart');

        //   if (heartIcon) {
        //     const movieTitle = target.closest('p').textContent.split(':')[1].trim();
        //     const movieData = data.results.find((movieResult) => movieResult.title === movieTitle);

        //     if (heartIcon.classList.contains('fa-regular')) {
        //       heartIcon.classList.remove('fa-regular');
        //       heartIcon.classList.add('fa-solid');
        //       heartIcon.style.color = '#ff0000';

        //       if (movieData) {
        //         likedMoviesArray.push(movieData);
        //       }
        //     } else if (heartIcon.classList.contains('fa-solid')) {
        //       heartIcon.classList.remove('fa-solid');
        //       heartIcon.classList.add('fa-regular');

        //       if (movieData) {
        //         const index = likedMoviesArray.findIndex((movie) => movie.id === movieData.id);
        //         if (index !== -1) {
        //           likedMoviesArray.splice(index, 1);
        //         }
        //       }
        //     }

        //     localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
        //   }
        // });

        
        moviesPresentation.addEventListener('click', (event) => {
          const target = event.target;
          const heartIcon = target.tagName === 'I' && target.classList.contains('fa-heart')
            ? target
            : target.closest('i.fa-heart');
        
          if (heartIcon) {
            let movieParagraph;
            if (target.tagName === 'P') {
              movieParagraph = target;
            } else {
              movieParagraph = target.closest('p');
            }
        
            if (movieParagraph && movieParagraph.textContent) {
              const movieTitleParts = movieParagraph.textContent.split(':');
        
              if (movieTitleParts.length > 1) {
                const movieTitle = movieTitleParts[1].trim();
                const movieData = data.results.find((movieResult) => movieResult.title === movieTitle);
        
                if (heartIcon.classList.contains('fa-regular')) {
                  heartIcon.classList.remove('fa-regular');
                  heartIcon.classList.add('fa-solid');
                  heartIcon.style.color = '#ff0000';
        
                  if (movieData) {
                    likedMoviesArray.push(movieData);
                  }
                } else if (heartIcon.classList.contains('fa-solid')) {
                  heartIcon.classList.remove('fa-solid');
                  heartIcon.classList.add('fa-regular');
        
                  if (movieData) {
                    const index = likedMoviesArray.findIndex((movie) => movie.id === movieData.id);
                    if (index !== -1) {
                      likedMoviesArray.splice(index, 1);
                    }
                  }
                }
        
                localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
              }
            }
          }
        });



        const updateHeartIcons = () => {
          const heartIcons = document.querySelectorAll('.heart-icon');
        
          heartIcons.forEach((heartIcon) => {
            const movieParagraph = heartIcon.closest('p');
        
            if (movieParagraph && movieParagraph.textContent) {
              const movieTitleParts = movieParagraph.textContent.split(':');
        
              if (movieTitleParts.length > 1) {
                const movieTitle = movieTitleParts[1].trim();
        
                if (likedMoviesArray.some((movie) => movie.title === movieTitle)) {
                  heartIcon.classList.remove('fa-regular');
                  heartIcon.classList.add('fa-solid');
                  heartIcon.style.color = '#ff0000';
                }
              }
            }
          });
        };
        
        updateHeartIcons();
        updatePagination(page, data.total_pages);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  document.querySelector('.pagination').style.display = 'none';

  dailyId.addEventListener('click', () => {
    popularity = 'day';
    currentPage = 1;
    fetchMovies(currentPage, popularity);
    setTimeout(() => {
      document.querySelector('.pagination').style.display = 'flex';
    }, 1000); // Delay for 1 second (1000 milliseconds)
  });
  
  weeklyId.addEventListener('click', () => {
    popularity = 'week';
    currentPage = 1;
    fetchMovies(currentPage, popularity);
    setTimeout(() => {
      document.querySelector('.pagination').style.display = 'flex';
    }, 1000); // Delay for 1 second (1000 milliseconds)
  });
  
  pagination.addEventListener('click', (event) => {
    const targetTagName = event.target.tagName;
  
    if (targetTagName === 'A' && !event.target.parentElement.classList.contains('disabled')) {
      event.preventDefault();
      const pageNumber = parseInt(event.target.textContent);
  
      if (pageNumber === currentPage) {
        return;
      }
  
      if (event.target.textContent === 'Previous') {
        currentPage--;
      } else if (event.target.textContent === 'Next') {
        currentPage++;
      } else {
        currentPage = pageNumber;
      }
  
      fetchMovies(currentPage, popularity);
    }
  });
  
  

  function updatePagination(currentPage, totalPages) {
    const pageItems = pagination.querySelectorAll('.page-item');
    pageItems.forEach((item) => item.classList.remove('active'));
  
    const pageLinks = pagination.querySelectorAll('.page-link');
  
    if (currentPage === 1) {
      pageItems[0].classList.add('disabled');
    } else {
      pageItems[0].classList.remove('disabled');
    }
  
    if (currentPage === 5) {
      pageItems[6].classList.add('disabled');
    } else {
      pageItems[6].classList.remove('disabled');
    }
  
    if (currentPage === totalPages) {
      pageItems[pageItems.length - 1].classList.add('disabled');
    } else {
      pageItems[pageItems.length - 1].classList.remove('disabled');
    }
  
    pageLinks.forEach((link, index) => {
      if (index === 0) {
        link.textContent = 'Previous';
      } else if (index === pageLinks.length - 1) {
        link.textContent = 'Next';
        if (currentPage >= totalPages || currentPage === 5) {
          document.getElementById('nextPage').classList.add('disabled');
        } else {
          document.getElementById('nextPage').classList.remove('disabled');
        }
      } else {
        const pageNumber = index;
        link.textContent = pageNumber.toString();
        if (pageNumber === currentPage) {
          pageItems[pageNumber].classList.add('active');
        }
      }
    });
  }
  
  
});
