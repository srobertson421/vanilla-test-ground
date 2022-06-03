import Observable from 'https://sean-cdn.netlify.app/js/observable/@0.0.1/observable.min.js';
import { match } from './path-to-regexp.js';

const currentRoute = new Observable(location.pathname);
const currentParams = new Observable({});
const currentPage = new Observable(document.querySelector('.page'));

const mainNavEl = document.getElementById('main-nav');
const pages = Array.from(document.querySelectorAll('.page'));

function route(newRoute) {
  currentRoute.value = newRoute;
  window.history.pushState({}, '', newRoute);
}

function renderPage(newRoute) {
  pages.forEach(pageNode => pageNode.style.display = 'none');

  const nextPage = pages.find(pageNode => {
    const matchFunction = match(pageNode.dataset.path, { decode: decodeURIComponent });
    const matchResult = matchFunction(newRoute);
    return matchResult;
  });

  const matchFunction = match(nextPage.dataset.path, { decode: decodeURIComponent });
  const matchResult = matchFunction(newRoute);
  
  currentParams.value = matchResult.params;

  nextPage.style.display = 'block';
  currentPage.value = nextPage;
}

currentRoute.subscribe(newRoute => {
  renderPage(newRoute);
});

currentPage.subscribe(newPage => {
  const paramEls = Array.from(newPage.querySelectorAll('*[data-param]'));
  paramEls.forEach(node => {
    const param = node.dataset.param;
    node.innerText = currentParams.value[param];
  });
});

mainNavEl.addEventListener('click', e => {
  if(e.target.tagName.toLowerCase() === 'a') {
    e.preventDefault();
    route(e.target.getAttribute('href'));
  }
});

window.addEventListener('popstate', e => {
  currentRoute.value = location.pathname;
});

renderPage(currentRoute.value);