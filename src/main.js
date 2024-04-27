import options from './options.js';

const listFieldElement = document.querySelector('.listField');
const inputElement = document.querySelector('#searchInput');
const buttonElement = document.querySelector('.searchButton');

async function fetchDataAndPopulateDOM() {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
      options
    );

    const data = await response.json();
    console.log('data::', data.results);
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

    buttonElement.addEventListener('click', (event) => {
      event.preventDefault();
      allCardHtml = ``;

      const fileredData = data.results.filter((item) =>
        item.original_title
          .toLowerCase()
          .includes(inputElement.value.toLowerCase())
      );
      if (fileredData.length === 0) {
        listFieldElement.innerText = 'There is no movie you are looking for';
      }
      fileredData.map((item) => {
        const filterdTempHtml = `<div class="cardItem" data-id=${item.id}>
        <img src="${imgRoot}${item.poster_path}" alt="movie_img" class="cardImg" />
        <div class="cardDescription">
          <h2 class="descTitle">${item.title}</h2>
          <p class="descVoteAvg">rating : ${item.vote_average}</p>
          <p class="descReleaseDate">release : ${item.release_date}</p>
          <p class="descOverview">${item.overview}</p>
        </div>
      </div>`;

        allCardHtml += filterdTempHtml;
      });
      listFieldElement.innerHTML = allCardHtml;
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
