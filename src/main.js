import options from './options.js';

const listFieldElement = document.querySelector('.listField');
const inputElement = document.querySelector('#searchInput');
const buttonElement = document.querySelector('.searchButton');
const notFoundContainer = document.querySelector('.notFoundContainer');
const returnBtn = document.querySelector('.returnBtn');

async function fetchDataAndPopulateDOM() {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
      options
    );

    const data = await response.json();
    const imgRoot = 'https://image.tmdb.org/t/p/w200';

    let allCardHtml = ``;

    data.results.map((item) => {
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

    const cardItemArray = [...listFieldElement.querySelectorAll('.cardItem')];
    cardItemArray.map((item) => {
      item.addEventListener('click', () => {
        alert(`영화 id: ${item.dataset.id}`);
      });
    });

    const elementArray = listFieldElement.querySelectorAll('.cardItem');

    buttonElement.addEventListener('click', (event) => {
      event.preventDefault();
      const keyword = inputElement.value.toLowerCase();

      for (let i = 0; i < elementArray.length; i++) {
        const movieTitle = elementArray[i]
          .querySelector('div')
          .querySelector('.descTitle')
          .innerText.toLowerCase();

        if (!movieTitle.includes(keyword)) {
          elementArray[i].classList.add('hidden');
        } else {
          elementArray[i].classList.remove('hidden');
        }
      }

      const result = Array.from(elementArray).every((item) => {
        return item.className.includes('hidden');
      });

      if (result) {
        notFoundContainer.classList.remove('hidden');
      } else {
        notFoundContainer.classList.add('hidden');
      }
    });
  } catch (error) {
    console.error(error);
  }
}

window.addEventListener('DOMContentLoaded', fetchDataAndPopulateDOM);
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
