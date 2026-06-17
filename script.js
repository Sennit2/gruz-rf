document.addEventListener('DOMContentLoaded', () => {
    // НАСТРОЙКИ TELEGRAM (Замените на свои данные)
    const TELEGRAM_TOKEN = '8711337483:AAGBfeIq2P6xuzhYpS3jPmrDj-37jPGOf08';
    const CHAT_ID = '1130972729';

    const calcForm = document.querySelector('.calc-form');

    if (calcForm) {
        calcForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Отменяем стандартную перезагрузку страницы

            // Находим кнопку отправки и блокируем её на время запроса
            const submitBtn = calcForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'ОТПРАВКА...';

            // Собираем данные из формы
            const selectedTransport = calcForm.querySelector('input[name="transport"]:checked');
            const transportName = selectedTransport ? selectedTransport.closest('.transport-tab').querySelector('.tab-name').textContent : 'Не выбран';
            
            const fromLocation = document.getElementById('calc-from').value;
            const toLocation = document.getElementById('calc-to').value;
            const userPhone = document.getElementById('calc-phone').value;

            // Формируем красивый текст сообщения для Telegram
            let message = `🚚 *Новая заявка с сайта ГРУЗРФ!*\n\n`;
            message += `📦 *Транспорт:* ${transportName}\n`;
            message += `📍 *Откуда:* ${fromLocation}\n`;
            message += `🏁 *Куда:* ${toLocation}\n`;
            message += `📞 *Телефон:* ${userPhone}`;

            // URL для отправки запроса к API Telegram
           const url = 'https://telegram.org' + TELEGRAM_TOKEN + '/sendMessage';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        parse_mode: 'Markdown',
                        text: message
                    })
                });

                if (response.ok) {
                    alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
                    calcForm.reset(); // Сбрасываем поля формы
                } else {
                    throw new Error('Ошибка сервера при отправке');
                }
            } catch (error) {
                console.error(error);
                alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.');
            } finally {
                // Возвращаем кнопку в исходное состояние
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});