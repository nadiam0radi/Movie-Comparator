const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData
}) => {
  root.innerHTML = `
    <label class="mb-2 block font-bold text-slate-700">Search</label>
    <input
      class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
      autocomplete="off"
    />
    <div class="dropdown relative mt-1 hidden">
      <div class="absolute left-0 top-0 z-20 w-full">
        <div class="results max-h-[500px] overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg"></div>
      </div>
    </div>
  `;

  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const resultsWrapper = root.querySelector('.results');

  const closeDropdown = () => dropdown.classList.add('hidden');
  const openDropdown = () => dropdown.classList.remove('hidden');

  const onInput = async event => {
    const items = await fetchData(event.target.value);

    if (!items.length) {
      closeDropdown();
      return;
    }

    resultsWrapper.innerHTML = '';
    openDropdown();

    for (let item of items) {
      const option = document.createElement('a');

      option.className = 'flex h-[60px] cursor-pointer items-center px-3 py-2 text-slate-700 transition hover:bg-slate-100';
      option.innerHTML = renderOption(item);
      option.addEventListener('click', () => {
        closeDropdown();
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      resultsWrapper.appendChild(option);
    }
  };

  input.addEventListener('input', debounce(onInput, 500));

  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      closeDropdown();
    }
  });
};
