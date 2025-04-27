class WorldClock {
    constructor() {
        // Existing time-related elements
        this.timeDisplay = document.getElementById('time');
        this.dateDisplay = document.getElementById('date');
        this.timezoneSelect = document.getElementById('timezone-select');
        this.timeFormatToggle = document.getElementById('time-format');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.lightThemeBtn = document.getElementById('theme-light');
        this.darkThemeBtn = document.getElementById('theme-dark');
        this.langEnBtn = document.getElementById('lang-en');
        this.langTrBtn = document.getElementById('lang-tr');

        // New chronometer-related elements
        this.chronometerDisplay = document.getElementById('chronometer');
        this.startPauseBtn = document.getElementById('start-pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.lapBtn = document.getElementById('lap-btn');
        this.lapList = document.getElementById('lap-list');

        this.is24HourFormat = true;
        this.currentTimezone = 'local';
        this.currentLanguage = 'en';

        // Chronometer variables
        this.chronoInterval = null;
        this.chronoStartTime = 0;
        this.chronoPausedTime = 0;
        this.chronoElapsedTime = 0;
        this.chronoIsRunning = false;
        this.lapCounter = 0;

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

        this.initChronoEventListeners();

        setInterval(() => this.updateClock(), 1000);
    }

    initChronoEventListeners() {
        this.startPauseBtn.addEventListener('click', () => this.toggleChronometer());
        this.resetBtn.addEventListener('click', () => this.resetChronometer());
        this.lapBtn.addEventListener('click', () => this.recordLap());
    }

    toggleChronometer() {
        if (!this.chronoIsRunning) {
            // Start chronometer
            this.chronoStartTime = Date.now() - this.chronoElapsedTime;
            this.chronoInterval = setInterval(() => this.updateChronometer(), 10);
            this.startPauseBtn.textContent = this.getLangText('Pause', 'Duraklat');
            this.chronoIsRunning = true;
        } else {
            // Pause chronometer
            clearInterval(this.chronoInterval);
            this.chronoElapsedTime = Date.now() - this.chronoStartTime;
            this.startPauseBtn.textContent = this.getLangText('Continue', 'Devam Et');
            this.chronoIsRunning = false;
        }
    }

    updateChronometer() {
        this.chronoElapsedTime = Date.now() - this.chronoStartTime;
        this.chronometerDisplay.textContent = this.formatChronoTime(this.chronoElapsedTime);
    }

    resetChronometer() {
        clearInterval(this.chronoInterval);
        this.chronoStartTime = 0;
        this.chronoElapsedTime = 0;
        this.chronoIsRunning = false;
        this.chronometerDisplay.textContent = '00:00:00.00';
        this.startPauseBtn.textContent = this.getLangText('Start', 'Başlat');
        this.lapList.innerHTML = '';
        this.lapCounter = 0;
    }

    recordLap() {
        if (this.chronoIsRunning || this.chronoElapsedTime > 0) {
            this.lapCounter++;
            const lapTime = this.formatChronoTime(this.chronoElapsedTime);
            const lapItem = document.createElement('li');
            lapItem.textContent = `Lap ${this.lapCounter}: ${lapTime}`;
            this.lapList.prepend(lapItem);
        }
    }

    formatChronoTime(time) {
        const ms = Math.floor((time % 1000) / 10);
        const secs = Math.floor((time / 1000) % 60);
        const mins = Math.floor((time / (1000 * 60)) % 60);
        const hrs = Math.floor((time / (1000 * 60 * 60)) % 24);

        return `${this.pad(hrs)}:${this.pad(mins)}:${this.pad(secs)}.${this.pad(ms)}`;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }

    getLangText(enText, trText) {
        return this.currentLanguage === 'en' ? enText : trText;
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

        // Update chronometer button texts
        this.startPauseBtn.textContent = this.getLangText('Start', 'Başlat');
        this.resetBtn.textContent = this.getLangText('Reset', 'Sıfırla');
        this.lapBtn.textContent = this.getLangText('Lap', 'Tur');

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