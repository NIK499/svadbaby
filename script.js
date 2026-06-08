// === НАСТРОЙКИ EMAILJS (Вставьте сюда свои данные) ===
const PUBLIC_KEY  = "6aY4osHCDW1Jm2ljK";  
const SERVICE_ID  = "service_2wz8qxo";  
const TEMPLATE_ID = "template_qevmej8"; 
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {

    // 1. ОПРЕДЕЛЕНИЕ ЯЗЫКА И АВТОПЕРЕВОД
    const userLang = navigator.language || navigator.userLanguage;
    const isEnglish = userLang.toLowerCase().includes('en'); // true, если язык английский//

    if (isEnglish) {
        // Переводим обычный текст
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute('data-en');
        });
        // Переводим подсказки (placeholder) в полях
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            el.setAttribute('placeholder', el.getAttribute('data-en-placeholder'));
        });
        // Переводим значения, которые отправляются на почту
        document.querySelectorAll('[data-en-value]').forEach(el => {
            el.setAttribute('value', el.getAttribute('data-en-value'));
        });
    }

    // Тексты уведомлений в зависимости от языка
    const messages = {
        sending: isEnglish ? 'SENDING...' : 'ОТПРАВКА...',
        sendBtn: isEnglish ? 'SEND' : 'ОТПРАВИТЬ',
        success: isEnglish ? 'Your response has been successfully sent! Thank you!' : 'Ваш ответ успешно отправлен! Спасибо!',
        error: isEnglish ? 'Server error: ' : 'Ошибка сервера EmailJS: ',
        scriptError: isEnglish ? 'Internal error: ' : 'Внутренняя ошибка скрипта: ',
        none: isEnglish ? 'Not specified' : 'Не указано',
        noDrinks: isEnglish ? 'No drinks selected' : 'Напитки не выбраны'
    };



    const weddingForm = document.querySelector('form');
    if (!weddingForm) return;

    weddingForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Намертво блокируем перезагрузку

        const submitButton = weddingForm.querySelector('button');
        if (submitButton) {
            submitButton.textContent = 'ОТПРАВКА...';
            submitButton.disabled = true;
        }

        try {
            // Безопасный сбор данных всей формы (код НЕ упадет, если имён нет)
            const formData = new FormData(weddingForm);
            
            // Вытаскиваем значения. Если имя не совпало, запишется "Не указано"
            const name = formData.get('name') || 'Не указано';
            const phone = formData.get('phone') || 'Не указано';
            const attendance = formData.get('attendance') || 'Не указано';
            const wish = formData.get('wish') || 'Не указано';
            const eat = formData.get('eat') || 'Не указано';

            // Собираем все выбранные чекбоксы напитков
            const drinksArray = formData.getAll('drinks');
            const drinks = drinksArray.length > 0 ? drinksArray.join(', ') : 'Напитки не выбраны';

            // Формируем пакет для EmailJS
            const packetData = {
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: PUBLIC_KEY,
                template_params: {
                    name: name,
                    phone: phone,
                    attendance: attendance,
                    drinks: drinks,
                    wish: wish,
                    eat: eat
                }
            };

            // Отправка прямому адресату
            fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packetData)
            })
            .then(response => {
                if (response.ok) {
                    alert('Ваш ответ успешно отправлен! Спасибо!');
                    weddingForm.reset(); // Очистка полей
                } else {
                    return response.text().then(text => { throw new Error(text) });
                }
            })
            .catch(error => {
                alert('Ошибка сервера EmailJS: ' + error.message);
            })
            .finally(() => {
                // В любом случае возвращаем кнопку в строй
                if (submitButton) {
                    submitButton.textContent = 'ОТПРАВИТЬ';
                    submitButton.disabled = false;
                }
            });

        } catch (scriptError) {
            // Если что-то сломалось внутри сбора данных, мы мгновенно узнаем об этом
            alert('Внутренняя ошибка скрипта: ' + scriptError.message);
            if (submitButton) {
                submitButton.textContent = 'ОТПРАВИТЬ';
                submitButton.disabled = false;
            }
        }
    });
});



// === СКРИПТ ТАЙМЕРА ОБРАТНОГО ОТСЧЕТА ===
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем дату свадьбы: 18 сентября 2026 года, 00:00:00
    const targetDate = new Date('September 18, 2026 00:00:00').getTime();

    // Находим элементы на странице, куда будем записывать цифры
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const countdownElement = document.getElementById('countdown');

    // Если элементов таймера нет на этой странице, скрипт просто не будет работать (чтобы не было ошибок)
    if (!daysElement) return;

    // Обновляем таймер каждую 1 секунду
    const timerInterval = setInterval(function() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // Если дата свадьбы уже наступила
        if (difference < 0) {
            clearInterval(timerInterval);
            countdownElement.innerHTML = "<h3 style='color: #ad8a60;'>Этот день настал! 🎉</h3>";
            return;
        }

        // Математический расчет дней, часов, минут и секунд
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Красиво выводим цифры (padStart добавляет нолик впереди, если цифра меньше 10, например: 05 вместо 5)
        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minutesElement.textContent = String(minutes).padStart(2, '0');
        secondsElement.textContent = String(seconds).padStart(2, '0');
    }, 1000);
});
document.addEventListener('DOMContentLoaded', function() {
    const langBtn = document.getElementById('lang-toggle-btn');
    if (!langBtn) return; // Если кнопки нет на странице, скрипт спать

    // 1. Автоматически запоминаем оригинальные русские тексты из HTML
    document.querySelectorAll('[data-en]').forEach(el => el.setAttribute('data-ru', el.textContent));
    document.querySelectorAll('[data-en-placeholder]').forEach(el => el.setAttribute('data-ru-placeholder', el.getAttribute('placeholder') || ''));
    document.querySelectorAll('[data-en-value]').forEach(el => el.setAttribute('data-ru-value', el.getAttribute('value') || ''));

    // 2. Определяем начальный язык браузера гостя
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = userLang.toLowerCase().includes('en') ? 'en' : 'ru';

    // Функция, которая на лету меняет язык на сайте
    function switchLanguage(lang) {
        const isEn = lang === 'en';
        
        // Меняем обычный текст
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = isEn ? el.getAttribute('data-en') : el.getAttribute('data-ru');
        });
        // Меняем подсказки в полях (placeholder)
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            el.setAttribute('placeholder', isEn ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-ru-placeholder'));
        });
        // Меняем значения (value) — это то, что ваш основной код отправит в EmailJS!
        document.querySelectorAll('[data-en-value]').forEach(el => {
            el.setAttribute('value', isEn ? el.getAttribute('data-en-value') : el.getAttribute('data-ru-value'));
        });

        // Меняем надпись на самой кнопке переключения
        langBtn.textContent = isEn ? 'RU' : 'EN';
    }

    // Включаем нужный язык при первой загрузке страницы
    switchLanguage(currentLang);

    // Следим за кликом по кнопке переключения
    langBtn.addEventListener('click', function() {
        currentLang = (currentLang === 'ru') ? 'en' : 'ru';
        switchLanguage(currentLang);
    });
});
