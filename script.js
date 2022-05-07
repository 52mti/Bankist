'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');

const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContents = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: s1coords.left,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////
//tabbed component
tabsContainer.addEventListener('click', function (e) {
  //matching target
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //guard clause
  if (!clicked) return;

  // remove active classes
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabsContents.forEach(el =>
    el.classList.remove('operations__content--active')
  );

  //active tab
  clicked.classList.add('operations__tab--active');

  //active corresponding content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (link !== sibling) sibling.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind('0.5'));
nav.addEventListener('mouseout', handleHover.bind('1'));

// const initialCoord = section1.getBoundingClientRect();
// console.log(initialCoord);

// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY >= initialCoord.y) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const obsOptions = {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(header);

//////////////////////////////////
//Reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// const revealSection = function (entries, observer) {
//   const [entry] = entries;
//   console.log(entry);
//   if (entry.isIntersecting) entry.target.classList.remove('section--hidden');
//   else entry.target.classList.add('section--hidden');
// };

// const sectionObserver = new IntersectionObserver(revealSection, {
//   boot: null,
//   threshold: 0.15,
// });

// const sections = document.querySelectorAll('.section');

// sections.forEach(section => {
//   section.classList.add('section--hidden');
//   sectionObserver.observe(section);
// });

/////////Lazy-load img
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  rootMargin: '200px',
  threshold: 1,
});

const imgs = document.querySelectorAll('.features__img');

imgs.forEach(img => imgObserver.observe(img));

////////Slider
const slider = function () {
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const slides = document.querySelectorAll('.slide');
  const dotConainer = document.querySelector('.dots');
  let curSlide;

  // 一开始每个slide的transform值逐次增加，这些slides组成一横
  // 点击btnRight或btnLeft之后，在slides组成一横的基础上右移或者左移
  // 因此，为实现整体移动，我们就需要在i的基础上再添加condition
  // 所以要变化的是i的部分，在i那里添加condition（也就是变量）
  // 每点击一次btnRight，变量使得在这个基础上整体-1，也就是每个i都-1
  // 如果点击两次btnRight，每个i都-2

  // Functions
  const moveSlides = function () {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - curSlide) * 100}%)`;
    });
    updateDots();
  };

  const nextSlide = function () {
    curSlide++;
    if (curSlide === slides.length) curSlide = 0;
    moveSlides();
  };

  const prevSlide = function () {
    curSlide--;
    if (curSlide === -1) curSlide = slides.length - 1;
    moveSlides();
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotConainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const updateDots = function () {
    const dots = document.querySelectorAll('.dots__dot');

    dots.forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`button[data-slide="${curSlide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    curSlide = 0;
    createDots();
    moveSlides();
  };

  // Event handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotConainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;

    curSlide = e.target.dataset.slide;
    moveSlides();
    updateDots();
  });

  init();
};

slider();
