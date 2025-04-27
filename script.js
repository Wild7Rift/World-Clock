class WorldClock {
    constructor() {
        this.timeDisplay = document.getElementById('time');
        this.dateDisplay = document.getElementById('date');
        this.timezoneSelect = document.getElementById('timezone-select');
        this.timeFormatToggle = document.getElementById('time-format');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.lightThemeBtn = document.getElementById('theme-light');
        this.darkThemeBtn = document.getElementById('theme-dark');
        this.langEnBtn = document.getElementById('lang-en');
        this.langTrBtn = document.getElementById('lang-tr');

        this.is24HourFormat = true;
        this.currentTimezone = 'local';
        this.currentLanguage = 'en';

        this.initEventListeners();
        this.updateClock();
        this.updateLanguage(this.currentLanguage);
    }

    initEventListeners() {
        this.timezoneSelect.addEventListener('change', (e) => {
            this.currentTimezone = e.target.value;
        });

        this.timeFormatToggle.addEventListener('change', () => {
            this.is24HourFormat = this.timeFormatToggle.checked;
        });

        this.fullscreenBtn.addEventListener('click', this.toggleFullScreen.bind(this));

        this.lightThemeBtn.addEventListener('click', () => this.setTheme('light'));
        this.darkThemeBtn.addEventListener('click', () => this.setTheme('dark'));

        // Language toggle
        this.langEnBtn.addEventListener('click', () => this.updateLanguage('en'));
        this.langTrBtn.addEventListener('click', () => this.updateLanguage('tr'));

        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const options = { 
            timeZone: this.currentTimezone === 'local' ? undefined : this.currentTimezone,
            hour12: !this.is24HourFormat 
        };

        const locales = {
            'en': 'en-US',
            'tr': 'tr-TR'
        };

        const timeString = now.toLocaleTimeString(locales[this.currentLanguage], {
            ...options,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const dateString = now.toLocaleDateString(locales[this.currentLanguage], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        this.timeDisplay.textContent = timeString;
        this.dateDisplay.textContent = dateString;
    }

    updateLanguage(lang) {
        this.currentLanguage = lang;

        // Update language button active state
        this.langEnBtn.classList.toggle('active', lang === 'en');
        this.langTrBtn.classList.toggle('active', lang === 'tr');

        // Update timezone select options
        Array.from(this.timezoneSelect.options).forEach(option => {
            option.textContent = option.getAttribute(`data-${lang}`);
        });

        // Update other language-specific elements
        document.querySelectorAll('[data-en][data-tr]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        // Update the clock to reflect the new language
        this.updateClock();
    }

    toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    setTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WorldClock();
});