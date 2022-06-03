import Observable from 'https://sean-cdn.netlify.app/js/observable/@0.0.1/observable.min.js';

const fetchPokeBtn = document.getElementById('fetch-poke-btn');
const pokeContainerEl = document.getElementById('poke-container');
const pokeNameEl = pokeContainerEl.querySelector('#poke-name');
const pokeImgEl = pokeContainerEl.querySelector('#poke-img');

const currentPokemon = new Observable(null);
const loadingPokemon = new Observable(false);

const POKEMON_MAX_ID = 890;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fetchPokemon() {
  loadingPokemon.value = true;
  const randId = getRandomInt(1, POKEMON_MAX_ID);

  return fetch(`https://pokeapi.co/api/v2/pokemon/${randId}`)
  .then(res => res.json())
  .then(result => {
    console.log(result);
    currentPokemon.value = result;
    loadingPokemon.value = false;
  })
  .catch(err => {
    console.log(err);
    loadingPokemon.value = false;
  });
}

function renderPokemon() {
  pokeNameEl.innerText = currentPokemon.value.name;
  pokeImgEl.setAttribute('alt', currentPokemon.value.name);
  pokeImgEl.setAttribute('src', currentPokemon.value.sprites.front_default);
}

loadingPokemon.subscribe((loadingState) => {
  if(!loadingState) {
    renderPokemon();
  }
});

fetchPokeBtn.addEventListener('click', () => {
  fetchPokemon();
});