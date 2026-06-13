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

for (let movie of movies) {
  const option = document.createElement('a');
  const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

  option.className =
    'flex h-[60px] cursor-pointer items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100';

  option.innerHTML = `
    <img class="h-[50px] w-[35px] object-cover" src="${imgSrc}" alt="${movie.Title}" />
    <span>${movie.Title}</span>
  `;

  option.addEventListener('click', () => {
    dropdown.classList.add('hidden');
    input.value = movie.Title;
    onMovieSelect(movie);
  });

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
  document.querySelector('#summary').innerHTML = movieTemplate(response.data);
}

const movieTemplate = movieDetail => {
  return `
    <article class="mt-8 flex flex-col gap-6 md:flex-row">
      <figure class="flex justify-center bg-black md:w-40 md:flex-none">
        <p class="flex justify-center bg-black">
          <img class="w-32 object-cover" src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="flex-1">
        <div>
          <h1 class="mb-2 text-3xl font-semibold leading-tight">${movieDetail.Title}</h1>
          <h4 class="mb-3 text-xl font-semibold text-gray-700">${movieDetail.Genre}</h4>
          <p class="leading-7 text-gray-700">${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article class="mt-5 rounded bg-teal-500 p-5 text-white shadow">
      <p class="text-2xl font-semibold leading-tight">${movieDetail.Awards}</p>
      <p class="mt-1 text-xl">Awards</p>
    </article>
    <article class="mt-5 rounded bg-teal-500 p-5 text-white shadow">
      <p class="text-2xl font-semibold leading-tight">${movieDetail.BoxOffice}</p>
      <p class="mt-1 text-xl">Box Office</p>
    </article>
    <article class="mt-5 rounded bg-teal-500 p-5 text-white shadow">
      <p class="text-2xl font-semibold leading-tight">${movieDetail.Metascore}</p>
      <p class="mt-1 text-xl">Metascore</p>
    </article>
    <article class="mt-5 rounded bg-teal-500 p-5 text-white shadow">
      <p class="text-2xl font-semibold leading-tight">${movieDetail.imdbRating}</p>
      <p class="mt-1 text-xl">IMDB Rating</p>
    </article>
    <article class="mt-5 rounded bg-teal-500 p-5 text-white shadow">
      <p class="text-2xl font-semibold leading-tight">${movieDetail.imdbVotes}</p>
      <p class="mt-1 text-xl">IMDB Votes</p>
    </article>
  `;
};
