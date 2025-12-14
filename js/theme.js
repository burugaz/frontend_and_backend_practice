// js/theme.js

// Состояние темы
let currentTheme = 'light';

// Инициализация темы
function initTheme() {
    // Получаем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    currentTheme = savedTheme;

    // Применяем тему к текущей странице
    applyTheme(savedTheme);

    // Создаем переключатель на всех страницах
    createThemeToggle();

    // Настраиваем переключатель
    setupThemeToggle();
}

// Применение темы
function applyTheme(theme) {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
        htmlElement.classList.add('theme-dark');
        htmlElement.classList.remove('theme-light');
    } else {
        htmlElement.classList.remove('theme-dark');
        htmlElement.classList.add('theme-light');
    }

    // Сохраняем в localStorage
    localStorage.setItem('theme', theme);
    currentTheme = theme;

    // Обновляем переключатель
    updateThemeToggle(theme);
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
    themeSwitch.innerHTML = `
        <input type="checkbox" id="theme-toggle" class="theme-switch__checkbox">
        <label for="theme-toggle" class="theme-switch__label">
            <span class="theme-switch__emoji">☀️</span>
            <span class="theme-switch__slider">
                <span class="theme-switch__knob"></span>
            </span>
            <span class="theme-switch__emoji">🌙</span>
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
    if (!themeToggle) return;

    // Устанавливаем состояние переключателя
    themeToggle.checked = currentTheme === 'dark';

    // Добавляем обработчик
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
    });
}

// Обновление состояния переключателя
function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = theme === 'dark';
    }
}

// Проверяем тему при загрузке каждой страницы
function checkThemeOnPageLoad() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('theme-dark');
    }
}

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    checkThemeOnPageLoad();
});

// Экспортируем функции для использования в других файлах
window.themeManager = {
    initTheme,
    applyTheme,
    getCurrentTheme: () => currentTheme
};