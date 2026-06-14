const statPrimaryClasses = ['bg-teal-500', 'text-white'];
const statWarningClasses = ['bg-yellow-400', 'text-yellow-950'];
const statBaseClasses = [
  'movie-stat',
  'mt-5',
  'rounded-md',
  'px-5',
  'py-4',
  'shadow-sm',
  'transition-colors'
];

const autoCompleteConfig = {
  renderOption(movie) {
    const poster = movie.Poster === 'N/A'
      ? '<span class="mr-3 h-[50px] w-[34px] flex-shrink-0 rounded bg-slate-200"></span>'
      : `<img class="mr-3 h-[50px] w-[34px] flex-shrink-0 rounded object-cover" src="${movie.Poster}" alt="${movie.Title} poster" />`;

    return `
      ${poster}
      <span>${movie.Title} (${movie.Year})</span>
    `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(searchTerm) {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: 'd9835cc5',
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }

    return response.data.Search;
  }
};

createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
  }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  });

  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === 'left') {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    '#left-summary .movie-stat'
  );
  const rightSideStats = document.querySelectorAll(
    '#right-summary .movie-stat'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = Number(leftStat.dataset.value);
    const rightSideValue = Number(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove(...statPrimaryClasses);
      leftStat.classList.add(...statWarningClasses);
    } else {
      rightStat.classList.remove(...statPrimaryClasses);
      rightStat.classList.add(...statWarningClasses);
    }
  });
};

const statCardClasses = [...statBaseClasses, ...statPrimaryClasses].join(' ');

const movieTemplate = movieDetail => {
  const dollars = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, '')
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
    <article class="mt-8 flex gap-4">
      <figure class="flex min-w-[128px] justify-center bg-black">
        <img class="w-32 object-cover" src="${movieDetail.Poster}" alt="${movieDetail.Title} poster" />
      </figure>
      <div class="min-w-0 flex-1">
        <div>
          <h1 class="text-3xl font-semibold leading-tight text-slate-900">${movieDetail.Title}</h1>
          <h4 class="mt-1 text-xl font-semibold text-slate-700">${movieDetail.Genre}</h4>
          <p class="mt-3 text-slate-700">${movieDetail.Plot}</p>
        </div>
      </div>
    </article>

    <article data-value=${awards} class="${statCardClasses}">
      <p class="text-3xl font-semibold leading-tight">${movieDetail.Awards}</p>
      <p class="mt-1 text-xl font-light">Awards</p>
    </article>
    <article data-value=${dollars} class="${statCardClasses}">
      <p class="text-3xl font-semibold leading-tight">${movieDetail.BoxOffice}</p>
      <p class="mt-1 text-xl font-light">Box Office</p>
    </article>
    <article data-value=${metascore} class="${statCardClasses}">
      <p class="text-3xl font-semibold leading-tight">${movieDetail.Metascore}</p>
      <p class="mt-1 text-xl font-light">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="${statCardClasses}">
      <p class="text-3xl font-semibold leading-tight">${movieDetail.imdbRating}</p>
      <p class="mt-1 text-xl font-light">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="${statCardClasses}">
      <p class="text-3xl font-semibold leading-tight">${movieDetail.imdbVotes}</p>
      <p class="mt-1 text-xl font-light">IMDB Votes</p>
    </article>
  `;
};
