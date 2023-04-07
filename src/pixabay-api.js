import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '35032685-0f1bd8026b75402faf76ec69b';

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
  }

  async fetchGallery() {
    
    try {
      const { data } = await axios.get(`${this.#BASE_URL}`, {
        params: {
          key: this.#API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: this.PER_PAGE,
        },
      }); 
      return data;

    } catch (error) {
      console.log(error);
    }
  }
}

