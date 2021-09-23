'use strict';
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

///////////////////////////////////////
// Modal window
const openModal = function (event) {
  event.preventDefault();
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

/*
 * Button Scrolling
 */
btnScrollTo.addEventListener('click', function (event) {
  // Old school way
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Only works in modern browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

/*
 * Page navigation
 */
// document.querySelectorAll('.nav__link').forEach(function (element) {
//   element.addEventListener('click', function (event) {
//     event.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Event delegation
// 1. Add event listener to common parent element
// 2. Determin what element originated the event
document
  .querySelector('.nav__links')
  .addEventListener('click', function (event) {
    event.preventDefault();

    // Matching strategy
    const elEventHappened = event.target;
    if (elEventHappened.classList.contains('nav__link')) {
      const id = elEventHappened.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

/*
 * Tabbed component
 */
tabsContainer.addEventListener('click', function (event) {
  // Find the button element
  const clicked = event.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/*
 * Menu fade animation
 */
const handleHover = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const link = event.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // It is impossible to pass another argument into an event handler function.
    // If we want to pass additional values into the handler function,
    // then we need to use the 'this' keyword.
    siblings.forEach(element => {
      if (element !== link) element.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1.0));

/*
 * Sticky navigation: Intersection Observer API
 */
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const stickyNavOptions = {
  // The root element is the element that we want our target element to intersect.
  // Set root element to null will let us observe our target element intersecting
  // the entire viewport.
  root: null,
  // Threshold is the percentage of intersection at which the observer callback
  // will be called. Set the threshold to 0 will show the sticky navigation as
  // soon as the header scrolls completely out of view.
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, stickyNavOptions);
headerObserver.observe(header);

/*
 * Reveal sections: Intersection Observer API
 */
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // Prevent this function from being triggered at the very beginning.
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  // It is no longer necessary to keep observing the sections.
  observer.unobserve(entry.target);
};
const revealSectionOptions = { root: null, threshold: 0.15 };

const sectionObserver = new IntersectionObserver(
  revealSection,
  revealSectionOptions
);
allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

/*
 * Lazy loading images
 */
const imgTarget = document.querySelectorAll('img[data-src]');

const lazyLoading = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};
const lazyLoadingOptions = { root: null, threshold: 0, rootMargin: '200px' };

const imgObserver = new IntersectionObserver(lazyLoading, lazyLoadingOptions);
imgTarget.forEach(img => imgObserver.observe(img));

/*
 * Slider
 */
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlideIndex = 0;
  const maxSlideIndex = slides.length - 1;

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slideIndex) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slideIndex}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (curSlide) {
    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${(index - curSlide) * 100}%)`)
    );
  };

  const nextSlide = function () {
    currentSlideIndex === maxSlideIndex
      ? (currentSlideIndex = 0)
      : currentSlideIndex++;
    goToSlide(currentSlideIndex);
    activateDot(currentSlideIndex);
  };
  const prevSlide = function () {
    currentSlideIndex === 0
      ? (currentSlideIndex = maxSlideIndex)
      : currentSlideIndex--;
    goToSlide(currentSlideIndex);
    activateDot(currentSlideIndex);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (event) {
    event.key === 'ArrowLeft' && prevSlide();
    event.key === 'ArrowRight' && nextSlide();
  });
  dotContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('dots__dot')) {
      const { slide } = event.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
