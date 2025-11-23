class MobileMenu {
    constructor() {
        this.burger = document.getElementById('navBurger');
        this.menu = document.getElementById('navMenu');
        this.overlay = document.getElementById('navOverlay');
        this.closeBtn = document.getElementById('navClose');
        this.floatingBtn = null;
        
        this.init();
    }
    
    init() {
        this.createFloatingButton();
        this.burger.addEventListener('click', () => this.toggleMenu());
        this.overlay.addEventListener('click', () => this.closeMenu());
        this.closeBtn.addEventListener('click', () => this.closeMenu());
        
        const menuLinks = this.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        window.addEventListener('scroll', () => this.handleScroll());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }
    
    createFloatingButton() {
        this.floatingBtn = document.createElement('button');
        this.floatingBtn.className = 'nav__floating';
        this.floatingBtn.innerHTML = `
        `;
        this.floatingBtn.setAttribute('aria-label', 'Открыть меню');
        
        document.body.appendChild(this.floatingBtn);
        
        this.floatingBtn.addEventListener('click', () => {
            this.openMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    toggleMenu() {
        const isOpening = !this.menu.classList.contains('active');
        
        this.menu.classList.toggle('active');
        this.burger.classList.toggle('active');
        this.overlay.classList.toggle('active');
        this.burger.style.display = isOpening ? 'none' : 'flex';
        
        if (this.floatingBtn) {
            this.floatingBtn.classList.toggle('active', isOpening);
            this.floatingBtn.style.display = isOpening ? 'none' : 'flex';
        }
        
        document.body.style.overflow = isOpening ? 'hidden' : '';
    }
    
    openMenu() {
        this.menu.classList.add('active');
        this.burger.classList.add('active');
        this.overlay.classList.add('active');
        this.burger.style.display = 'none';
        
        if (this.floatingBtn) {
            this.floatingBtn.classList.add('active');
            this.floatingBtn.style.display = 'none';
        }
        
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.menu.classList.remove('active');
        this.burger.classList.remove('active');
        this.overlay.classList.remove('active');
        this.burger.style.display = 'flex';
        
        if (this.floatingBtn) {
            this.floatingBtn.classList.remove('active');
            this.handleScroll();
        }
        
        document.body.style.overflow = '';
    }
    
    handleScroll() {
        if (window.innerWidth <= 991 && this.floatingBtn) {
            const scrollPosition = window.scrollY;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (scrollPosition > headerHeight + 100) {
                this.floatingBtn.style.display = 'none';
            } else {
                this.floatingBtn.style.display = 'none';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 991) {
        document.body.style.overflow = '';
        const burger = document.getElementById('navBurger');
        if (burger) {
            burger.style.display = 'none';
        }
    } else {
        const burger = document.getElementById('navBurger');
        const menu = document.getElementById('navMenu');
        if (burger && menu && !menu.classList.contains('active')) {
            burger.style.display = 'flex';
        }
    }
});

// Вставь в консоль браузера
(function(){
    console.log('=== ДИАГНОСТИКА ШИРИНЫ ===');
    console.log('window.innerWidth:', window.innerWidth);
    console.log('document.documentElement.clientWidth:', document.documentElement.clientWidth);
    console.log('document.documentElement.scrollWidth:', document.documentElement.scrollWidth);
    console.log('document.body.scrollWidth:', document.body.scrollWidth);
    
    // Находим самый широкий элемент
    let maxWidth = 0;
    let widestElement = null;
    
    document.querySelectorAll('*').forEach(el => {
        const width = el.getBoundingClientRect().width;
        const right = el.getBoundingClientRect().right;
        if (right > maxWidth) {
            maxWidth = right;
            widestElement = el;
        }
    });
    
    console.log('Самый правый элемент:', widestElement);
    console.log('Его правая граница:', maxWidth);
    
    return {
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        difference: document.documentElement.scrollWidth - window.innerWidth,
        widestElement: widestElement
    };
})();

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Обработчик для всех якорных ссылок
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href*="#"]');
            
            if (link && this.isValidAnchor(link)) {
                e.preventDefault();
                this.scrollToAnchor(link.getAttribute('href'));
            }
        });

        // Обработчик для URL с якорями при загрузке страницы
        if (window.location.hash) {
            this.scrollToAnchor(window.location.hash);
        }
    }

    // Проверяем, валидная ли якорная ссылка
    isValidAnchor(link) {
        const href = link.getAttribute('href');
        
        // Исключаем ссылки, которые не ведут на ту же страницу
        if (href === '#' || href.startsWith('#')) {
            return true;
        }
        
        // Проверяем, что это якорь на той же странице
        try {
            const url = new URL(href, window.location.origin);
            return url.pathname === window.location.pathname && url.hash;
        } catch {
            return href.includes('#') && !href.startsWith('http');
        }
    }

    // Плавный скролл к якорю
    scrollToAnchor(anchor) {
        const targetId = anchor.includes('#') ? anchor.split('#')[1] : anchor.replace('#', '');
        const targetElement = document.getElementById(targetId);
        
        if (!targetElement) {
            console.warn(`Элемент с id "${targetId}" не найден`);
            return;
        }

        // Рассчитываем позицию с учетом фиксированного хедера
        const headerHeight = this.getHeaderHeight();
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        // Плавный скролл
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Обновляем URL в браузере
        this.updateUrl(anchor);
    }

    // Получаем высоту хедера
    getHeaderHeight() {
        const header = document.querySelector('.header');
        if (header) {
            return header.offsetHeight + 20; // +20px для отступа
        }
        return 80; // Fallback значение
    }

    // Обновляем URL без прыжка
    updateUrl(hash) {
        if (history.pushState) {
            history.pushState(null, null, hash);
        } else {
            window.location.hash = hash;
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
});