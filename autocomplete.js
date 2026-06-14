const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData
}) => {
root.innerHTML = `
  <label class="mb-2 block font-bold text-gray-800">Search</label>
  <input class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200" />
  <div class="dropdown relative hidden w-full">
    <div class="absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
      <div class="results max-h-80 overflow-y-auto py-1"></div>
    </div>
  </div>
`;
const input = root.querySelector('input');
const dropdown = root.querySelector('.dropdown');
const resultsWrapper = root.querySelector('.results');

let timeoutId;

const onInput = (event) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(async () => {
    const items = await fetchData(event.target.value);

    if(!items.length){
      dropdown.classList.add('hidden')
      return
    }
    resultsWrapper.innerHTML = '';
    dropdown.classList.remove('hidden');

for (let item of items) {
    const option = document.createElement('a');
    option.className =
    'flex h-[60px] cursor-pointer items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100';
    option.innerHTML = renderOption(item)
    option.addEventListener('click', () => {
    dropdown.classList.add('hidden');
    input.value = inputValue(item);
    onOptionSelect(item)
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
}