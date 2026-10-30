const themeButton = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function setTheme(theme, persist = false) {
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', String(isLight));
    themeButton.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeButton.title = `Switch to ${isLight ? 'dark' : 'light'} mode`;
    const label = themeButton.querySelector('.theme-label');
    const icon = themeButton.querySelector('.theme-icon');
    if (label) label.textContent = isLight ? 'Dark' : 'Light';
    if (icon) icon.textContent = isLight ? '☾' : '☼';
  }
  themeMeta?.setAttribute('content', isLight ? '#f4f7f2' : '#090c0b');
  if (persist) {
    try { localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark'); }
    catch { /* Theme still works for this visit when storage is unavailable. */ }
  }
}

let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('portfolio-theme') || 'dark'; }
catch { /* Continue with the dark theme when storage is unavailable. */ }
setTheme(savedTheme);
themeButton?.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
});

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation?.classList.toggle('is-open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
}));

document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  document.querySelectorAll('.filter-button').forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('.project-card').forEach((card) => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
  });
}));

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  if (formStatus) { formStatus.textContent = 'Sending your message…'; formStatus.classList.remove('error'); }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Your message could not be sent. Please try again.');
    contactForm.reset();
    if (formStatus) formStatus.textContent = 'Thanks — your note is in. I’ll be in touch soon.';
  } catch (error) {
    if (formStatus) {
      formStatus.textContent = error.message === 'Failed to fetch'
        ? 'The contact service is unavailable. Email emmanuelrolandbriggs@gmail.com instead.'
        : error.message;
      formStatus.classList.add('error');
    }
  } finally {
    submitButton.disabled = false;
  }
});
