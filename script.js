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
                    drinks: drinks
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