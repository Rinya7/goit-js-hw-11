const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { KEY } from './key.js';

async function getApiSearch(input, page) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${KEY}&q=${input}&image_type=photo&orientation=horizontal&safesearch=true&&page=${page}&per_page=40`
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    Notify.failure(error.message);
  }
}

export { getApiSearch };
