import ApiService from './scripts/Api';
import LoadMoreBtn from './scripts/LoadMoreBtn';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

const apiService = new ApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.button.addEventListener('click', onClickLoad);

function onFormSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const value = form.elements.searchQuery.value.trim();
  apiService.searchQuery = value;
  apiService.resetPage();
  clearImages();
  loadMoreBtn.show();
  onClickLoad().finally(() => form.reset());
}

async function onClickLoad() {
  loadMoreBtn.disable();

  try {
    const images = await apiService.getPictures();

    // if (images.length === 0) {
    //   loadMoreBtn.hide();
    //   Notiflix.Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    // }

    const markup = images.reduce(
      (markup, image) => createMarkup(image) + markup,
      ''
    );
    appendPictures(markup);
    loadMoreBtn.enable();
  } catch (error) {
    console.log(error);
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class ="photo-card">
    <a href="${largeImageURL}"> 
      <img
      src="${webformatURL}"
      alt="${tags}" 
      loading="lazy"
      />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>${likes}</p>
      <p class="info-item">
        <b>Views</b>${views}</p>
      <p class="info-item">
        <b>Comments</b>${comments}</p>
      <p class="info-item">
        <b>Downloads</b>${downloads}</p>
    </div>
  </div>`;
}

function appendPictures(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearImages() {
  gallery.innerHTML = '';
}
