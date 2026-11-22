// Mobile navigation
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Light / dark theme toggle (saved in this browser)
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') document.body.classList.add('light-theme');

function updateThemeButton() {
  const isLight = document.body.classList.contains('light-theme');
  themeToggle.textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}
updateThemeButton();
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  localStorage.setItem('portfolio-theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  updateThemeButton();
});

// Project details popups
const projectDetails = {
  bank: {
    category: 'JAVA · DESKTOP APPLICATION',
    title: 'Bank Management System',
    description: 'A desktop banking application concept designed to organise customer information and common account operations. Add your own implemented modules, screenshots and learning outcomes here.',
    stack: ['Java', 'Swing', 'OOP', 'MySQL (if implemented)']
  },
  inventory: {
    category: 'JAVA · MANAGEMENT APPLICATION',
    title: 'Inventory Management',
    description: 'An inventory application concept for adding products, viewing stock, updating product information and recording sales. Add details of the features you have completed.',
    stack: ['Java', 'ArrayList', 'OOP', 'Eclipse (if used)']
  },
  resqflow: {
    category: 'SMART MOBILITY · EMERGENCY RESPONSE',
    title: 'RESQFLOW',
    description: 'A smart ambulance-priority concept exploring how connected vehicles and traffic systems could help emergency vehicles move through congested roads. Add your actual team contribution and implementation details.',
    stack: ['V2X concepts', 'Smart traffic', 'Emergency response']
  }
};

const modal = document.getElementById('projectModal');
document.querySelectorAll('.project-open').forEach(button => {
  button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalStack').innerHTML = project.stack.map(item => `<span>${item}</span>`).join('');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('modalClose').focus();
  });
});
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}
document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

// Contact form: prepares an email in the visitor's default mail application.
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  // Replace this address with your real email before publishing.
  const recipient = 'jeeviammulu2005@gmail.com';
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`From: ${name}\nReply to: ${email}\n\n${message}`);
  document.getElementById('formNote').textContent = 'Opening your email application…';
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});

// Reveal sections as they enter the screen
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

// Current year and active navigation link
document.getElementById('year').textContent = new Date().getFullYear();
const sections = document.querySelectorAll('main section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObserver.observe(section));
const roles = [
  "3rd Year ISE Student",
  "Software Developer",
  "Java Enthusiast",
  "Frontend Developer",
  "Technology Enthusiast"
];

let roleIndex = 0;
const typingText = document.getElementById("typing-text");

function changeRole() {
  typingText.textContent = roles[roleIndex];
  roleIndex = (roleIndex + 1) % roles.length;
}

changeRole();
setInterval(changeRole, 2000);
window.addEventListener("scroll", () => {

const height =
document.documentElement.scrollHeight -
window.innerHeight;

const scrolled =
(window.scrollY / height) * 100;

document.getElementById("progress-bar")
.style.width = scrolled + "%";

});
const glow=document.querySelector(".cursor-glow");

document.addEventListener("mousemove",(e)=>{
  glow.style.left=e.clientX+"px";
  glow.style.top=e.clientY+"px";
});