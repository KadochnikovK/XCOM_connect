function initParallax(config) {
    const {
        n = 10,
        minSize = '3',
        maxSize = '6',
        url = '',
        minSpeed = 1.2,
        maxSpeed = 1.4,
        mouseSensitivity = 0.5 // Новая настройка: чувствительность к движению мыши
    } = config;

    // Создаем контейнер для параллакс элементов
    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';
    parallaxContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 300%;
        pointer-events: none;
        z-index: 1000;
        overflow: hidden;
    `;
    document.body.appendChild(parallaxContainer);

    // Массив для хранения элементов и их данных
    const parallaxElements = [];

    // Переменные для отслеживания положения мыши
    let mouseX = 0;
    let mouseY = 0;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    // Функция для генерации случайного числа в диапазоне
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Функция для проверки видимости элемента
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }

    // Создаем параллакс элементы
    for (let i = 0; i < n; i++) {
        const element = document.createElement('div');
        element.className = 'parallax-element';

        // Случайный размер
        const size = getRandom(
            parseFloat(minSize),
            parseFloat(maxSize)
        );
        // const sizeUnit = minSize.replace(/[0-9.]/g, '');

        // Случайная скорость
        const speed = getRandom(minSpeed, maxSpeed);

        // Случайная позиция
        const left = getRandom(0, 100);
        const top = getRandom(-50, 150); // Разрешаем элементы за пределами экрана

        // Случайный множитель для эффекта мыши (элементы с большей скоростью скролла будут сильнее реагировать на мышь)
        const mouseMultiplier = getRandom(0.3, 1.0) * mouseSensitivity;

        element.style.cssText = `
            position: absolute;
            width: calc(${size}vw + ${size}vh) ;
            height: calc(${size}vw + ${size}vh) ;
            left: ${left}%;
            top: ${top}%;
            background-image: url('${url}');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            will-change: transform;
            transition: 0.3s ease-out;
            opacity: 1;
        `;

        element.style.pointerEvents = 'auto'; // Allow this element to receive mouse/touch events

        // Mouse and touch event handlers
        element.addEventListener('mouseover', () => {
            element.style.opacity = '0';
        });

        // element.addEventListener('mouseout', () => {
        //     element.style.opacity = '1';
        // });

        // Touch events for mobile devices
        element.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent default touch behavior
            element.style.opacity = '0';
        });

        // element.addEventListener('touchend', () => {
        //     element.style.opacity = '1';
        // });

        parallaxContainer.appendChild(element);

        // Сохраняем данные элемента
        parallaxElements.push({
            element,
            speed,
            mouseMultiplier,
            baseTop: top,
            currentY: 0,
            mouseOffsetX: 0,
            mouseOffsetY: 0,
            isVisible: false,
            lastScrollY: window.scrollY
        });
    }

    // Обработчик движения мыши
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Обновляем центр при изменении размера окна
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
    }

    // Обработчик скролла
    let lastScrollY = window.scrollY;
    let rafId = null;

    function updateParallax() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

        // Вычисляем смещение мыши от центра экрана
        const mouseDeltaX = (mouseX - centerX) / centerX; // Нормализованное значение от -1 до 1
        const mouseDeltaY = (mouseY - centerY) / centerY; // Нормализованное значение от -1 до 1

        parallaxElements.forEach(item => {
            const isVisible = isElementInViewport(item.element);

            // Если видимость изменилась
            if (isVisible !== item.isVisible) {
                item.isVisible = isVisible;
                // При смене видимости сбрасываем lastScrollY чтобы избежать скачка
                item.lastScrollY = currentScrollY;
            }

            let movement = 0;

            if (item.isVisible) {
                // Когда элемент виден - применяем ускоренную скорость (движение вверх)
                movement = -scrollDelta * item.speed;
            } else {
                // Когда не виден - нормальная скорость скролла (движение вверх)
                movement = -scrollDelta;
            }

            // Обновляем позицию от скролла
            item.currentY += movement;

            // Вычисляем смещение от мыши (умножаем на множитель элемента)
            item.mouseOffsetX = mouseDeltaX * 20 * item.mouseMultiplier; // Максимальное смещение 20px
            item.mouseOffsetY = mouseDeltaY * 20 * item.mouseMultiplier; // Максимальное смещение 20px

            // Применяем оба преобразования: скролл и мышь
            item.element.style.transform = `
                translateY(${item.currentY}px)
                translateX(${item.mouseOffsetX}px)
                translateY(${item.mouseOffsetY}px)
            `;

            item.lastScrollY = currentScrollY;
        });

        lastScrollY = currentScrollY;
        rafId = requestAnimationFrame(updateParallax);
    }

    // Запускаем анимацию
    updateParallax();

    // Обработчики событий
    function handleResize() {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;

        parallaxElements.forEach(item => {
            item.isVisible = isElementInViewport(item.element);
        });
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Функция для очистки
    function destroy() {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (parallaxContainer.parentNode) {
            parallaxContainer.parentNode.removeChild(parallaxContainer);
        }
    }

    // Возвращаем методы для управления
    return {
        destroy,
        elements: parallaxElements
    };
}

// Использование
const parallax = initParallax({
    n: 25,
    minSize: '2',
    maxSize: '6',
    url: '/assets/images/parallax-item.png',
    minSpeed: .7,
    maxSpeed: 1.5,
    mouseSensitivity: 1 // Можно регулировать от 0 (нет эффекта) до 1 (максимальный эффект)
});