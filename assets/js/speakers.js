function toggleSocialLinks(linkElement) {
    event.preventDefault();

    const slide = linkElement.closest('.speakers__slide');
    const socialLinks = slide.querySelector('.speakers__social-links');
    const isActive = slide.classList.contains('speakers__slide--active');

    if (isActive) {
        // Возвращаем исходное состояние
        slide.classList.remove('speakers__slide--active');
        socialLinks.style.display = 'none';
        linkElement.textContent = 'нажми на меня!';
    } else {
        // Активируем карточку
        slide.classList.add('speakers__slide--active');
        socialLinks.style.display = 'block';
        linkElement.textContent = 'скрыть';
    }
}