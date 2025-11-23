const menu = document.querySelector('.menu');
const header = document.querySelector('.header');
const hamburger = document.querySelector('.menu__hamburger');

function toggleMenu() {
    menu.classList.toggle('menu--active');
    header.classList.toggle('header--active');
}

hamburger.addEventListener('click', toggleMenu);

const menuLinks = document.querySelectorAll('.menu__link');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('menu--active');
        header.classList.remove('header--active');
    });
});

// Закрытие меню при клике вне его области
document.addEventListener('click', (event) => {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger && menu.classList.contains('menu--active')) {
        menu.classList.remove('menu--active');
        header.classList.remove('header--active');
    }
});

// Закрытие меню при нажатии Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('menu--active')) {
        menu.classList.remove('menu--active');
        header.classList.remove('header--active');
    }
});