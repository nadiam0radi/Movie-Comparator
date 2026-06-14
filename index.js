

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
createAutoComplete({
  root:document.querySelector('.autocomplete'),
  renderOption(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return`
        <img class="h-[50px] w-[35px] object-cover" src{imgSrc}" alt="${movie.Title}" />
        <span>${movie.Title}</span> (${movie.Year})
    `
  }

})

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