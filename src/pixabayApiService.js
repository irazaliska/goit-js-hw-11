import axios from 'axios';

export class PixabayApiService {

  constructor() {
    this.API_KEY = '35032685-0f1bd8026b75402faf76ec69b';
    this.BASE_URL = 'https://pixabay.com/api/';
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }
  async fetchGallery() {
    try {
      const { data } = await axios.get(`${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}`, {
        params: {
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: this.per_page,
        },
      }); 
      this.page += 1;
      return data;

    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch gallery');
    }
  }
    
  resetPage() {
    this.page = 1;
  }
}

