document.addEventListener('DOMContentLoaded', () => {
    // 1. НАСТРОЙКА МАСКИ ТЕЛЕФОНА
    const phoneInput = document.getElementById('calc-phone');
    let phoneMask;

    if (phoneInput) {
        phoneMask = IMask(phoneInput, {
            mask: '+{7} (000) 000-00-00',
            lazy: false
        });
    }

    // 2. ЛОГИКА МОДАЛЬНОГО ОКНА
    const successModal = document.getElementById('success-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const okBtn = document.getElementById('ok-modal-btn');

    function openModal() {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden'; /* Блокируем прокрутку сайта под окном */
    }

    function closeModal() {
        successModal.classList.remove('active');
        document.body.style.overflow = ''; /* Возвращаем прокрутку */
    }

    // Закрытие по клику на элементы управления
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);

    // Закрытие по клику на темную область вокруг карточки
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }


    // 3. НАСТРОЙКИ TELEGRAM И ОТПРАВКА ФОРМЫ
    const TELEGRAM_TOKEN = '8711337483:AAGBfeIq2P6xuzhYpS3jPmrDj-37jPGOf08';
    const CHAT_ID = 1130972729;
    const calcForm = document.querySelector('.calc-form');

    if (calcForm) {
        calcForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (phoneMask && !phoneMask.masked.isComplete) {
                alert('Пожалуйста, введите номер телефона полностью.');
                phoneInput.focus();
                phoneInput.style.borderColor = '#ff0000';
                return;
            } else {
                phoneInput.style.borderColor = '';
            }

            const submitBtn = calcForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'ОТПРАВКА...';

            const selectedTransport = calcForm.querySelector('input[name="transport"]:checked');
            const transportName = selectedTransport ? selectedTransport.closest('.transport-tab').querySelector('.tab-name').textContent : 'Не выбран';
            
            const fromLocation = document.getElementById('calc-from').value;
            const toLocation = document.getElementById('calc-to').value;
            const userPhone = phoneMask.masked.value;

            let message = `🚚 *Новая заявка с сайта ГРУЗРФ!*\n\n`;
            message += `📦 *Транспорт:* ${transportName}\n`;
            message += `📍 *Откуда:* ${fromLocation}\n`;
            message += `🏁 *Куда:* ${toLocation}\n`;
            message += `📞 *Телефон:* ${userPhone}`;

            const url = `https://telegram.org{TELEGRAM_TOKEN}/sendMessage`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        parse_mode: 'Markdown',
                        text: message
                    })
                });

                if (response.ok) {
                    openModal(); // Вместо alert() плавно показываем наше стильное окно
                    calcForm.reset();
                    if (phoneMask) phoneMask.updateValue();
                } else {
                    throw new Error('Ошибка сервера при отправке');
                }
            } catch (error) {
                console.error(error);
                alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
