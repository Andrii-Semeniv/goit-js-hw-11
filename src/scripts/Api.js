import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '33912497-3359e04dc8606dd645c853c21';

export default class ApiService {
  constructor() {
    this.page = 1;
    this.per_page = 40;
    this.searchQuery = '';
  }
  async getPictures() {
    try {
      const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;

      const response = await axios.get(url);
      this.nextPage();
      return response.data.hits;
    } catch (error) {
      console.error(error);
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }

  nextPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
