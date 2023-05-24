import { Notify } from 'notiflix/build/notiflix-notify-aio';
Notify.success('Починаємо пошук');
import { getApiSearch } from './javascript.js/axios.js';

const refs = {
  searchInputForm: document.querySelector('#search-form'),
  btnStartSearch: document.querySelector('.btn-send'),
  contentForPictures: document.querySelector('.gallery'),
  btnMoreSearch: document.querySelector('.load-more'),
};
let page = 1;

refs.btnStartSearch.addEventListener('click', btnInputSearchStart);
refs.btnMoreSearch.addEventListener('click', btnMoreDownload);

function btnInputSearchStart(event) {
  event.preventDefault();
  const inputText = refs.searchInputForm.elements.searchQuery.value;
  if (inputText) {
    getApiSearch(inputText, page).then(data => {
      //  console.log(data.total);
      if (data.total) {
        Notify.failure(`Hooray! We found ${data.totalHits} images.`);

        const { hits } = data;
        createPage(hits);
        if (data.hits.length === 40) {
          refs.btnMoreSearch.style.opacity = '1';
        } else {
          Notify.failure(
            "We're sorry, but you've reached the end of search results."
          );
        }
      } else {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    });
  } else {
    Notify.failure('Ви нічого не ввели');
  }
}

async function btnMoreDownload() {
  page += 1;
  const inputText = refs.searchInputForm.elements.searchQuery.value;
  getApiSearch(inputText, page).then(data => {
    //console.log(data.hits.length);
    console.log(data.totalHits);
    if (data.hits.length > 39) {
      Notify.failure(
        `Hooray! We found ${data.totalHits - data.hits.length} images.`
      );
      //  console.log(data.hits);
      //  console.log(data);
      //  console.log(hits);
      const { hits } = data;
      console.log(hits);
      createMorePage(data.hits);
    } else {
      const { hits } = data;
      console.log(hits);
      createMorePage(data.hits);
      refs.btnMoreSearch.setAttribute('disabled', '');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}

function createPage(arr) {
  return (refs.contentForPictures.innerHTML = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        (refs.contentForPictures.innerHTML = `
          <div class="photo-card">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <b>${likes}</b>
              </p>
              <p class="info-item">
                <b>Views</b>
                <b>${views}</b>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <b>${comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <b>${downloads}</b>
              </p>
            </div>
        </div>`)
    )
    .join(''));
}

function createMorePage(arr) {
  return refs.contentForPictures.insertAdjacentHTML(
    'beforeend',
    arr
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) =>
          refs.contentForPictures.insertAdjacentHTML(
            'beforeend',
            `
            <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <b>${likes}</b>
              </p>
              <p class="info-item">
                <b>Views</b>
                <b>${views}</b>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <b>${comments}</b>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <b>${downloads}</b>
              </p>
            </div>
          </div>`
          )
      )
      .join('')
  );
}
