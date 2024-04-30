import options from './options.js';

const listFieldElement = document.querySelector('.listField');
const inputElement = document.querySelector('#searchInput');
const buttonElement = document.querySelector('.searchButton');
const notFoundContainer = document.querySelector('.notFoundContainer');
const returnBtn = document.querySelector('.returnBtn');

function fetchData() {
  fetch(
    'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
    options
  )
    .then((response) => response.json())
    .then((data) => {
      const dataFormat = data.results;
      populateDOM(dataFormat);
      alertCardId();
      searchMovieTitle();
    })
    .catch((error) => console.error(error));
}

function populateDOM(data) {
  const imgRoot = 'https://image.tmdb.org/t/p/w200';
  let allCardHtml = ``;

  data.forEach((item) => {
    const tempHtml = `<div class="cardItem" data-id=${item.id}>
    <img src="${imgRoot}${item.poster_path}" alt="movie_img" class="cardImg" />
    <div class="cardDescription">
      <h2 class="descTitle">${item.title}</h2>
      <p class="descVoteAvg">rating : ${item.vote_average}</p>
      <p class="descReleaseDate">release : ${item.release_date}</p>
      <p class="descOverview">${item.overview}</p>
    </div>
  </div>`;

    allCardHtml += tempHtml;
  });
  listFieldElement.innerHTML = allCardHtml;
}

function alertCardId() {
  const cardItemArray = [...listFieldElement.querySelectorAll('.cardItem')];
  cardItemArray.forEach((item) => {
    item.addEventListener('click', () => {
      alert(`영화 id: ${item.dataset.id}`);
    });
  });
}

function searchMovieTitle() {
  const elementArray = listFieldElement.querySelectorAll('.cardItem');
  buttonElement.addEventListener('click', (event) => {
    event.preventDefault();
    const keyword = inputElement.value.toLowerCase();

    elementArray.forEach((_, index) => {
      const movieTitle = elementArray[index]
        .querySelector('div')
        .querySelector('.descTitle')
        .innerText.toLowerCase();

      if (!movieTitle.includes(keyword)) {
        elementArray[index].classList.add('hidden');
      } else {
        elementArray[index].classList.remove('hidden');
      }
    });

    const result = Array.from(elementArray).every((item) => {
      return item.className.includes('hidden');
    });

    if (result) {
      notFoundContainer.classList.remove('hidden');
    } else {
      notFoundContainer.classList.add('hidden');
    }
  });
}

fetchData();

window.addEventListener('load', () => inputElement.focus());

const originalPlaceholder = inputElement.placeholder;
inputElement.addEventListener('focus', function () {
  this.placeholder = '';
});
inputElement.addEventListener('blur', function () {
  this.placeholder = originalPlaceholder;
});
returnBtn.addEventListener('click', () => {
  window.location.reload();
});
