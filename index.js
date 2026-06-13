const { assignWith } = require("lodash-es");

const fetchData = async (searchTerm) => {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: 'af62b238',
        s: searchTerm
      }
    });

    if(response.data.Error){
        return []
    }
    return response.data.Search;
  }
const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label class="mb-2 block font-bold text-gray-800">Search For a Movie</label>
  <input class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
  <div class="dropdown relative hidden w-full">
    <div class="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
      <div class="results max-h-80 overflow-y-auto py-1"></div>
    </div>
  </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

let timeoutId;

const onInput = (event) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(async () => {
    const movies = await fetchData(event.target.value);

    if(!movies.length){
      dropdown.classList.add('hidden')
      return
    }
    resultsWrapper.innerHTML = '';
    dropdown.classList.remove('hidden');

    for (let movie of movies){
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

    option.className = 'flex h-[60px] cursor-pointer items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100';
    option.innerHTML = `
      <img class="h-[50px] w-[35px] object-cover" src="${imgSrc}" alt="${movie.Title}" />
      <span>${movie.Title}</span>
    `;
      option.addEventListener('click',()=>{
        dropdown.classList.add('hidden')
        input.value = movie.Title
      })
    resultsWrapper.appendChild(option);
    }
  }, 500);
};
input.addEventListener('input', onInput);
document.addEventListener('click', event => {
  if (!root.contains(event.target)) {
    dropdown.classList.add('hidden');
  }
});
const onMovieSelect = async (movie) => {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: 'af62b238',
        i: movie.imdbID
      }
    });
    console.log(response.data)
}