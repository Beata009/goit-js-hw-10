import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('#country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const query = event.target.value.trim();

  if (!query) {
    clearCountries();
    return;
  }

  fetchCountries(query)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        clearCountries();
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountryList(countries);
      } else if (countries.length === 1) {
        renderCountryInfo(countries[0]);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      clearCountries();
    });
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
                <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="50">
                <span>${country.name.official}</span>
              </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
  countryInfo.innerHTML = '';
}

function renderCountryInfo(country) {
  const markup = `
    <h2><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="50"> ${country.name.official}</h2>
    <p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${Object.values(country.languages).join(', ')}</p>
  `;
  countryInfo.innerHTML = markup;
  countryList.innerHTML = '';
}

function clearCountries() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
