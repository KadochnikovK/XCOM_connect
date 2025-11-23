function initParallax(config) {
    const {
        n = 10,
        minSize = '3',
        maxSize = '6',
        url = '',
        minSpeed = 1.2,
        maxSpeed = 1.4,
        mouseSensitivity = 0.5 
    } = config;


    const parallaxContainer = document.createElement('div');
    parallaxContainer.className = 'parallax-container';
    parallaxContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 500%;
        pointer-events: none;
        z-index: 1000;
        overflow: hidden;
    `;
    document.body.appendChild(parallaxContainer);

  
    const parallaxElements = [];

 
    let mouseX = 0;
    let mouseY = 0;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

 
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

  
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }

   
    for (let i = 0; i < n; i++) {
        const element = document.createElement('div');
        element.className = 'parallax-element';

   
        const size = getRandom(
            parseFloat(minSize),
            parseFloat(maxSize)
        );
        // const sizeUnit = minSize.replace(/[0-9.]/g, '');

     
        const speed = getRandom(minSpeed, maxSpeed);

      
        const left = getRandom(0, 100);
        const top = getRandom(-50, 150); 


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

        element.style.pointerEvents = 'auto';


        element.addEventListener('mouseover', () => {
            element.style.opacity = '0';
        });

        // element.addEventListener('mouseout', () => {
        //     element.style.opacity = '1';
        // });


        element.addEventListener('touchstart', (e) => {
            e.preventDefault(); 
            element.style.opacity = '0';
        });

        // element.addEventListener('touchend', () => {
        //     element.style.opacity = '1';
        // });

        parallaxContainer.appendChild(element);

        
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

    
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
    }

  
    let lastScrollY = window.scrollY;
    let rafId = null;

    function updateParallax() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;

       
        const mouseDeltaX = (mouseX - centerX) / centerX; 
        const mouseDeltaY = (mouseY - centerY) / centerY; 

        parallaxElements.forEach(item => {
            const isVisible = isElementInViewport(item.element);

         
            if (isVisible !== item.isVisible) {
                item.isVisible = isVisible;
                
                item.lastScrollY = currentScrollY;
            }

            let movement = 0;

            if (item.isVisible) {
                
                movement = -scrollDelta * item.speed;
            } else {
             
                movement = -scrollDelta;
            }

            item.currentY += movement;

            item.mouseOffsetX = mouseDeltaX * 20 * item.mouseMultiplier; 
            item.mouseOffsetY = mouseDeltaY * 20 * item.mouseMultiplier; 
          
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

   
    updateParallax();

 
    function handleResize() {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;

        parallaxElements.forEach(item => {
            item.isVisible = isElementInViewport(item.element);
        });
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);


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

  
    return {
        destroy,
        elements: parallaxElements
    };
}


const parallax = initParallax({
    n: 25,
    minSize: '2',
    maxSize: '6',
    url: 'assets/images/parallax-item.png',
    minSpeed: .7,
    maxSpeed: 1.5,
    mouseSensitivity: 1 
});