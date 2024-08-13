/* * * * * * * * * * * * * * * * * * * * * * * *
 * demo.js
 *
 * Здесь код для демонстрации фронтенда тестировщику и примера другим разработчикам.
 * Не подключайте этот файл к настоящему сайту.
 *
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме "Заказать обратный звонок"
 */
if (callbackModalForm) {
  callbackModalForm.setHandlers(
    (data) => {
      showAlert({
        heading: 'Ваша заявка успешно отправлена',
        text: 'Наш менеджер свяжется с вам в течение дня',
        buttonText: 'Закрыть'
      });
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме "Заполните форму на выкуп машины"
 */
if (buyModalForm) {
  buyModalForm.setHandlers(
    (data) => {
      showAlert({
        heading: 'Ваша заявка успешно отправлена',
        text: 'Наш менеджер свяжется с вам в течение дня',
        buttonText: 'Закрыть'
      });
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме "Заявка на запчасть"
 */
if (requestForm) {
  requestForm.setHandlers(
    (data) => {
      showAlert({
        heading: 'Ваша заявка успешно отправлена',
        text: 'Наш менеджер свяжется с вам в течение дня',
        buttonText: 'Закрыть'
      });
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме "Подписаться на рассылку"
 */
if (subscriptionForm) {
  subscriptionForm.setHandlers(
    (data) => {
      showAlert({
        heading: 'Спасибо за подписку',
        text: 'Вы успешно подписались на email рассылку',
        buttonText: 'Закрыть'
      });
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось подписаться на рассылку',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме "Оставить отзыв"
 */
if (reviewModalForm) {
  reviewModalForm.setHandlers(
    (data) => {
      showAlert({
        heading: 'Спасибо, что оценили нашу работу',
        mode: 'alter',
        text: 'Ваш отзыв будет проверен модератором сайта, и опубликован в течение 2 рабочих дней',
        buttonText: 'Закрыть'
      });
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление товара в корзину
 */
let cartModalAlert = null;
const cartModalAlertElement = document.querySelector('.modal--with_cart-alert');

if (cartModalAlertElement) {
  cartModalAlert = new Modal(cartModalAlertElement);
}

document.addEventListener('click', (evt) => {
  const productCartButtonElement = evt.target.closest('[data-product-cart-button]');

  if (cartModalAlert && productCartButtonElement) {
    cartModalAlert.open();
  }
});
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме корзины
 */
if (cart?.form) {
  cart.form.setHandlers(
    (data) => {
      window.location.href = 'https://umnyash.github.io/truckstar/order.html';
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заказ',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в формах модального окна "Войти / Зарегистрироваться"
 */
if (modalEntry) {
  modalEntry.codeForm.setHandlers(
    (data) => {
      console.info('Запрошен код')
      modalEntry.switchStep(2);
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось получить код',
        buttonText: 'Повторить'
      });
    }
  );

  modalEntry.loginForm.setHandlers(
    (data) => {
      console.info('Авторизация произошла')
      modalEntry.close();
      modalEntry.switchStep(1);
    },
    (data) => {
      showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить код',
        buttonText: 'Повторить'
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */
