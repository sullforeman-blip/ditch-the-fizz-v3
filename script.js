// Ditch the Fizz: small interactive touches

const filterButtons = document.querySelectorAll('.filter');
const drinkCards = document.querySelectorAll('.drink-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const chosen = button.dataset.filter;
    drinkCards.forEach((card) => {
      const show = chosen === 'all' || card.dataset.category === chosen;
      card.classList.toggle('hidden', !show);
    });
  });
});

// Reveal sections gently as they enter the screen
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

// Recipe idea popups
const recipes = {
  infusion: {
    title: 'Four fruit infusion ideas',
    text: 'Try strawberry + basil, cucumber + mint + lime, blueberry + lemon + ginger, or pineapple + orange. Add fruit and herbs to cold water and let the flavors mingle in the fridge. Taste as you go.'
  },
  berry: {
    title: 'Berry lime cooler',
    text: 'Add a handful of berries, a few lime slices, and mint to a glass. Lightly press the fruit to release flavor, add ice and cold water, or use sparkling water for bubbles. Adjust to your taste.'
  },
  blueberry: {
    title: 'Blueberry mint chill',
    text: 'Add blueberries and mint to cold water. Gently press a few berries, add ice, and let it sit for a little while so the flavor develops. A squeeze of lemon can brighten it up.'
  },
  smoothie: {
    title: 'Sunny fruit blend',
    text: 'Blend a mix of ripe fruit with plain yogurt or milk for a creamy smoothie, or use water for a lighter blend. Try banana with berries or pineapple with mango.'
  }
};
const modal = document.querySelector('#recipe-modal');
const modalTitle = document.querySelector('#modal-title');
const modalText = document.querySelector('#modal-text');
document.querySelectorAll('.recipe-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const recipe = recipes[button.dataset.recipe];
    if (!recipe) return;
    modalTitle.textContent = recipe.title;
    modalText.textContent = recipe.text;
    modal.showModal();
  });
});
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
// Mobile navigation menu
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.navlinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('mobile-open');
  menuToggle.textContent = isOpen ? '×' : '☰';
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    menuToggle.textContent = '☰';
  });
});
console.log('Ditch the Fizz is ready to refresh!');

// Extra interaction polish: click feedback, card spotlight, and reading progress
const progressBar = document.createElement('div');
progressBar.id = 'page-progress';
progressBar.setAttribute('aria-hidden', 'true');
document.body.prepend(progressBar);
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = Math.min(100, Math.max(0, amount)) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Soft mouse-follow highlight inside drink cards
drinkCards.forEach(card => {
  card.addEventListener('mousemove', event => {
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', (event.clientX - box.left) + 'px');
    card.style.setProperty('--mouse-y', (event.clientY - box.top) + 'px');
  });
  card.addEventListener('mouseleave', () => {
    card.style.removeProperty('--mouse-x');
    card.style.removeProperty('--mouse-y');
  });
});
// Small button press feedback
 document.querySelectorAll('.button-dark, .button-light, .nav-cta').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.add('button-press');
    window.setTimeout(() => button.classList.remove('button-press'), 160);
  });
});
// Pop cards gently when a filter is selected
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    drinkCards.forEach(card => {
      if (!card.classList.contains('hidden')) {
        card.classList.remove('card-pop');
        void card.offsetWidth;
        card.classList.add('card-pop');
      }
    });
  });
});


// V2: "Surprise me" picks one visible drink idea and highlights it.
const surpriseButton = document.querySelector('#surprise-drink');
if (surpriseButton) {
  surpriseButton.addEventListener('click', () => {
    const availableCards = [...drinkCards].filter(card => !card.classList.contains('hidden'));
    const pool = availableCards.length ? availableCards : [...drinkCards];
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    drinkCards.forEach(card => card.classList.remove('surprise-highlight'));
    chosen.classList.remove('hidden');
    chosen.classList.remove('card-pop');
    void chosen.offsetWidth;
    chosen.classList.add('card-pop', 'surprise-highlight');
    chosen.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const toast = document.querySelector('#fizz-toast') || document.createElement('div');
    toast.id = 'fizz-toast';
    toast.textContent = 'Your fresh idea: ' + chosen.querySelector('h3').textContent + ' ✨';
    if (!toast.isConnected) document.body.appendChild(toast);
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 2600);
  });
}

// Clear a previous surprise highlight when a filter is changed.
filterButtons.forEach(button => button.addEventListener('click', () => {
  drinkCards.forEach(card => card.classList.remove('surprise-highlight'));
}));


// V3: floating fruit decorations and pointer tilt (disabled on touch/reduced motion)
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && !heroVisual.querySelector('.floating-fruit')) {
  const fruitBits = [
    { emoji: '🍋', className: 'fruit-one', time: '5.2s', delay: '-1.1s' },
    { emoji: '🍓', className: 'fruit-two', time: '6.3s', delay: '-2.4s' },
    { emoji: '🍊', className: 'fruit-three', time: '4.8s', delay: '-.7s' }
  ];
  fruitBits.forEach((fruit) => {
    const item = document.createElement('span');
    item.className = 'floating-fruit ' + fruit.className;
    item.textContent = fruit.emoji;
    item.setAttribute('aria-hidden', 'true');
    item.style.setProperty('--float-time', fruit.time);
    item.style.setProperty('--float-delay', fruit.delay);
    heroVisual.appendChild(item);
  });
}
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOK && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  drinkCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      if (card.classList.contains('hidden')) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - .5) * 8;
      const rotateX = (.5 - y) * 7;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
// Give the surprise action a tiny sparkle-style feedback on activation.
if (surpriseButton) {
  surpriseButton.addEventListener('click', () => {
    surpriseButton.classList.remove('surprise-pulse');
    void surpriseButton.offsetWidth;
    surpriseButton.classList.add('surprise-pulse');
  });
}
