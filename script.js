// === НАСТРОЙКИ EMAILJS (Вставьте сюда свои данные) ===
const PUBLIC_KEY  = "6aY4osHCDW1Jm2ljK";  
const SERVICE_ID  = "service_2wz8qxo";  
const TEMPLATE_ID = "template_qevmej8"; 
// ====================================================================

document.addEventListener('DOMContentLoaded', function() {
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