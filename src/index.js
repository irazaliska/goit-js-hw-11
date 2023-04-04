import './css/styles.css';
import { PixabayApiService } from './pixabayApiService';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabay = new PixabayApiService();
const gallery = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', handleFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMore);

hideLoadMoreBtn();

async function handleFormSubmit(event) {
  event.preventDefault();
  resetGallery();

  pixabay.searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (pixabay.searchQuery === '') {
    Notify.warning(`Please enter a search query.`, 
    { position: 'center-center', cssAnimationStyle: 'from-top',
    });
    return;
  }

  try {
    const { hits: results, totalHits: total } = await pixabay.fetchGallery();
    
    if (total === 0) {
      Notify.warning(`Sorry, there are no results for query. Please try again.`, 
      { position: 'center-center', cssAnimationStyle: 'from-top',
      });
      return;
    }

    if (results.length < 40) { 
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }

    Notify.success(`Hooray! We found ${total} images.`);

    renderGallery(results);

  } catch (error) { 
      console.log(error);
      Notify.failure('Something went wrong. Please try again later.');
    }
}

async function handleLoadMore() {
  try {
    const { hits: results } = await pixabay.fetchGallery();
    
    if (results.length < 40) {
      hideLoadMoreBtn();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  
    renderGallery(results);
  
  } catch (error) { 
      console.log(error);
      Notify.failure('Something went wrong. Please try again later.');
    }
}

  function renderGallery(images) {
    const markup = images.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `
      <a href="${largeImageURL}" class="photo-card">
      <img src="${webformatURL}" alt="${tags}" class="photo-card__img" width="270" loading="lazy" />
      <div class="info">
      <p class="info-item"><b>Likes</b>${likes}</p>
      <p class="info-item"><b>Views</b>${views}</p>
      <p class="info-item"><b>Comments</b>${comments}</p>
      <p class="info-item"><b>Downloads</b>${downloads}</p>
      </div>
      </a>`;
    });

    galleryEl.insertAdjacentHTML('beforeend', markup.join(''));
    gallery.refresh();
  }

  function resetGallery() {
    galleryEl.innerHTML = '';
    pixabay.resetPage();
  }

  function hideLoadMoreBtn() {
    loadMoreBtnEl.classList.add('is-hidden');
  }

  function showLoadMoreBtn() {
    loadMoreBtnEl.classList.remove('is-hidden');
  }