// js/theme.js

// Состояние темы и доступности
let currentTheme = 'light';
let reducedMotion = false;

// Инициализация темы и доступности
function initTheme() {
    // Проверяем системные настройки
    checkSystemPreferences();

    // Получаем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;

    // Применяем тему к текущей странице
    applyTheme(savedTheme);

    // Создаем переключатель на всех страницах
    createThemeToggle();

    // Настраиваем переключатель
    setupThemeToggle();

    // Инициализируем доступность
    initAccessibility();
}

// Проверка системных настроек
function checkSystemPreferences() {
    // Проверяем предпочтения движения
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Проверяем высокую контрастность
    const highContrast = window.matchMedia('(prefers-contrast: high)').matches;

    // Добавляем соответствующие классы
    if (reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
    }

    if (highContrast) {
        document.documentElement.classList.add('high-contrast');
    }

    // Слушаем изменения настроек
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
        reducedMotion = e.matches;
        document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', e => {
        document.documentElement.classList.toggle('high-contrast', e.matches);
    });
}

// Применение темы
function applyTheme(theme) {
    const htmlElement = document.documentElement;

    // Добавляем класс для анимации переключения
    htmlElement.classList.add('theme-switching');

    if (theme === 'dark') {
        htmlElement.classList.add('theme-dark');
        htmlElement.classList.remove('theme-light');
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.classList.remove('theme-dark');
        htmlElement.classList.add('theme-light');
        htmlElement.setAttribute('data-theme', 'light');
    }

    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
    currentTheme = theme;

    // Обновляем переключатель
    updateThemeToggle(theme);

    // Уведомляем другие компоненты о смене темы
    dispatchThemeChangeEvent(theme);

    // Убираем класс анимации после завершения
    setTimeout(() => {
        htmlElement.classList.remove('theme-switching');
    }, 300);
}

// Создание переключателя темы
function createThemeToggle() {
    // Проверяем, есть ли уже переключатель
    if (document.querySelector('.theme-switch')) {
        return;
    }

    // Создаем HTML переключателя
    const themeSwitch = document.createElement('div');
    themeSwitch.className = 'theme-switch';
    themeSwitch.setAttribute('role', 'switch');
    themeSwitch.setAttribute('aria-label', 'Переключить тему');
    themeSwitch.setAttribute('aria-checked', currentTheme === 'dark');
    themeSwitch.innerHTML = `
        <input type="checkbox"
               id="theme-toggle"
               class="theme-switch__checkbox"
               aria-label="Переключить тему между светлой и темной">
        <label for="theme-toggle" class="theme-switch__label">
            <span class="theme-switch__emoji" aria-hidden="true">☀️</span>
            <span class="theme-switch__slider">
                <span class="theme-switch__knob"></span>
            </span>
            <span class="theme-switch__emoji" aria-hidden="true">🌙</span>
            <span class="sr-only">Темная тема</span>
        </label>
    `;

    // Добавляем переключатель в header
    const header = document.querySelector('.header');
    if (header) {
        header.appendChild(themeSwitch);
    }
}

// Настройка переключателя
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeSwitch = document.querySelector('.theme-switch');

    if (!themeToggle || !themeSwitch) return;

    // Устанавливаем состояние переключателя
    themeToggle.checked = currentTheme === 'dark';
    themeSwitch.setAttribute('aria-checked', currentTheme === 'dark');

    // Добавляем обработчик
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        themeSwitch.setAttribute('aria-checked', newTheme === 'dark');
        applyTheme(newTheme);
    });

    // Добавляем клавиатурную навигацию
    themeToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.click();
        }
    });
}

// Обновление состояния переключателя
function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const themeSwitch = document.querySelector('.theme-switch');

    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
    }

    if (themeSwitch) {
        themeSwitch.setAttribute('aria-checked', theme === 'dark');
    }
}

// Отправка события о смене темы
function dispatchThemeChangeEvent(theme) {
    const event = new CustomEvent('themechange', {
        detail: { theme: theme }
    });
    document.dispatchEvent(event);
}

// Инициализация доступности
function initAccessibility() {
    // Добавляем ARIA-атрибуты для навигации
    const nav = document.querySelector('.nav');
    if (nav && !nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Основная навигация');
    }

    // Добавляем ARIA-атрибуты для основного контента
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
        main.setAttribute('tabindex', '-1');
    }

    // Добавляем ARIA-атрибуты для футера
    const footer = document.querySelector('.footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }

    // Инициализируем управление фокусом
    initFocusManagement();

    // Добавляем обработчики для улучшения клавиатурной навигации
    initKeyboardNavigation();
}

// Управление фокусом
function initFocusManagement() {
    // Скрываем фокус для мыши, но показываем для клавиатуры
    document.addEventListener('mousedown', function() {
        document.documentElement.classList.add('using-mouse');
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.documentElement.classList.remove('using-mouse');
        }
    });

    // Восстанавливаем фокус после навигации
    let lastFocusedElement = null;

    document.addEventListener('focusin', function(event) {
        lastFocusedElement = event.target;
    });

    // Функция для восстановления фокуса
    window.restoreFocus = function() {
        if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
        }
    };
}

// Клавиатурная навигация
function initKeyboardNavigation() {
    // Обработка Escape для закрытия элементов
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            // Закрываем модальные окна
            const openModal = document.querySelector('dialog[open]');
            if (openModal) {
                openModal.close();
            }

            // Закрываем выпадающие меню
            const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
            openDropdowns.forEach(dropdown => {
                dropdown.setAttribute('aria-expanded', 'false');
            });
        }
    });

    // Ловушка фокуса для модальных окон
    document.addEventListener('focusin', function(event) {
        const modal = event.target.closest('dialog[open]');
        if (modal) {
            trapFocusInModal(modal, event);
        }
    });
}

// Захват фокуса в модальном окне
function trapFocusInModal(modal, event) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.target === firstElement && event.shiftKey) {
        event.preventDefault();
        lastElement.focus();
    } else if (event.target === lastElement && !event.shiftKey) {
        event.preventDefault();
        firstElement.focus();
    }
}

// Проверяем тему при загрузке каждой страницы
function checkThemeOnPageLoad() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Проверяем системные настройки
    checkSystemPreferences();
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    checkThemeOnPageLoad();

    // Добавляем стили для улучшения доступности
    addAccessibilityStyles();
});

// Добавление стилей для доступности
function addAccessibilityStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Улучшенные стили фокуса */
        :focus-visible {
            outline: 3px solid var(--color-primary);
            outline-offset: 2px;
            border-radius: var(--border-radius-sm);
        }

        /* Скрываем outline при использовании мыши */
        .using-mouse :focus {
            outline: none;
        }

        /* Стили для скрытых элементов */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        /* Анимация переключения темы */
        .theme-switching * {
            transition: none !important;
        }

        /* Улучшенная читаемость для выделенного текста */
        ::selection {
            background-color: var(--color-primary);
            color: var(--color-white);
        }

        /* Улучшенные стили для disabled элементов */
        [disabled],
        [aria-disabled="true"] {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* Индикатор текущего элемента для скринридеров */
        [aria-current="page"],
        [aria-current="true"] {
            position: relative;
        }

        [aria-current="page"]::after,
        [aria-current="true"]::after {
            content: " (текущая)";
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);
}

// Вспомогательные функции для доступности
function announceToScreenReader(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';

    // Удаляем старые объявления
    const oldAnnouncements = document.querySelectorAll('[aria-live]');
    oldAnnouncements.forEach(el => {
        if (el.parentNode && el !== announcement) {
            el.parentNode.removeChild(el);
        }
    });

    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Удаляем через некоторое время
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 3000);
}

// Экспортируем функции для использования в других файлах
window.themeManager = {
    initTheme,
    applyTheme,
    getCurrentTheme: () => currentTheme,
    isReducedMotion: () => reducedMotion,
    announceToScreenReader
};

// Экспортируем функции для доступности
window.accessibility = {
    trapFocusInModal,
    announceToScreenReader,
    restoreFocus: window.restoreFocus
};