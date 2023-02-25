import ApiService from './scripts/Api';
import LoadMoreBtn from './scripts/LoadMoreBtn';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');

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
  loadMoreBtn.show();
  onClickLoad().finally(() => form.reset());
}

async function onClickLoad() {
  loadMoreBtn.disable();
  let totalHits = 0;
  try {
    const images = await apiService.getPictures();
    totalHits += images.length;
    console.log(totalHits);
    console.log(images.length);
    if (images.length === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (totalHits !== 0 && images.length === 0) {
      loadMoreBtn.disable();
      loadMoreBtn.show();
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    console.log(error);
  }
}
