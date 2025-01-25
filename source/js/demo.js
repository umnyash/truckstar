/* * * * * * * * * * * * * * * * * * * * * * * *
 * demo.js
 *
 * Здесь код для демонстрации фронтенда тестировщику и примера другим разработчикам.
 * Не подключайте этот файл к настоящему сайту.
/* * * * * * * * * * * * * * * * * * * * * * * */
console.log('Подключён временный файл для демонстрации.')

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Пример реализации повторной отправки формы в случае ошибки.
 * Функция-помошник.
 */
function initFormResending(form, alert) {
  // Добавление обработчика нажатия на кнопку
  alert.button.addEventListener('click', (evt) => {
    evt.preventDefault();

    // Подписка на начало попытки отправить форму (используется паттерн Издатель-Подписчик)
    form.addListener(FormEvents.SUBMIT_START, onFormSubmitStart);

    // Форма отправляется повторно
    form.formElement.requestSubmit();
  });

  function onFormSubmitStart() {
    console.log('Начата попытка отправить данные.');

    // Удаление подписчика, так как модальное окно с сообщение (alert) – "одноразовое":
    // Будет удалено, так как при завершении попытки отправки формы создаётся новое.
    form.removeListener(FormEvents.SUBMIT_START, onFormSubmitStart);

    // Подписка на завершение попытки отправить форму (используется паттерн Издатель-Подписчик)
    form.addListener(FormEvents.SUBMIT_END, onFormSubmitEnd);

    // Блокировка кнопки отправки
    alert.button.disabled = true;
    alert.button.classList.add('button--pending');
  };

  function onFormSubmitEnd() {
    console.log('Попытка отправить данные завершена.');

    // Удаление подписчика
    form.removeListener(FormEvents.SUBMIT_END, onFormSubmitEnd);

    // Закрытие модального окна с сообщением. При этом оно удалится из DOM.
    if (alert.modalElement) { // Проверка, если пользователь уже сам закрыл это окно.
      alert.close();
    }
  }
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление обработчиков в форме "Подписаться на рассылку"
 */
if (subscriptionForm) {
  subscriptionForm.setHandlers(
    // Колбэк, вызываемый при успешной отправке данных
    (data) => { //
      console.log('Распарсенный ответ сервера:', data);

      showAlert({
        heading: 'Спасибо за подписку',
        text: 'Вы успешно подписались на email рассылку',
      });
    },
    // Колбэк, вызываемый при ошибке отправки данных
    (data) => {
      console.log('Распарсенный ответ сервера:', data);

      const alert = showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось подписаться на рассылку',
      });

      initFormResending(subscriptionForm, alert);
    }
  );
}
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
      });
    },
    (data) => {
      const alert = showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
      });

      initFormResending(callbackModalForm.form, alert);
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
      });
    },
    (data) => {
      const alert = showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
      });

      initFormResending(buyModalForm.form, alert);
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
      });
    },
    (data) => {
      const alert = showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
      });

      initFormResending(requestForm, alert);
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
      });
    },
    (data) => {
      const alert = showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заявку',
      });

      initFormResending(reviewModalForm.form, alert);
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
  const cartButtonElement = evt.target.closest('[data-product-cart-button]');
  const counterButtonMinusElement = evt.target.closest('.counter__button--minus');

  if (cartButtonElement) {
    const productElement = cartButtonElement.closest('.product-card, .product');
    const counterControlElement = productElement.querySelector('.counter__control');
    +counterControlElement.value++;
    const productInCartClass = productElement.matches('.product-card') ? 'product-card--in-cart' : 'product--in-cart';
    productElement.classList.add(productInCartClass);

    if (cartModalAlert) {
      cartModalAlert.open();
    }
  } else if (counterButtonMinusElement) {
    const productElement = counterButtonMinusElement.closest('.product-card, .product, .cart-item');
    const counterControlElement = productElement.querySelector('.counter__control');
    +counterControlElement.value--;

    if (+counterControlElement.value <= 0) {
      counterControlElement.value = 0;
      const productInCartClass = productElement.matches('.product-card') ? 'product-card--in-cart' : 'product--in-cart';
      productElement.classList.remove(productInCartClass);
    }
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
      const alert = showAlert({
        heading: 'Ошибка',
        status: 'error',
        text: 'Не удалось отправить заказ',
      });

      initFormResending(cart.form, alert);
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
      });
    }
  );
}
/* * * * * * * * * * * * * * * * * * * * * * * */

/* * * * * * * * * * * * * * * * * * * * * * * *
 * Добавление отзывов, ипользование функции createReviewsListItemString для создания HTML-разметки на основе данных.
 */
const mockReviewsData = [
  {
    author: 'Кирилл',
    text: 'Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую.',
    rating: 5,
    date: '2024-07-08'
  },
  {
    author: 'Кирилл',
    text: 'Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую. Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую. Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую.',
    rating: 4,
    date: '2024-07-25'
  },
  {
    author: 'Кирилл',
    text: 'Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую.',
    rating: 3,
    date: '2024-07-26'
  },
  {
    author: 'Кирилл',
    text: 'Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую. Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую. Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую.',
    rating: 2,
    date: '2024-07-26'
  },
  {
    author: 'Кирилл',
    text: 'Отличное место, помогли с подбором и выбором запчастей, хорошо упаковали и оперативно отправили, рекомендую.',
    rating: 1,
    date: '2024-08-08'
  },
];

const reviewsListWrapperElement = document.querySelector('.reviews-list');

if (reviewsListWrapperElement) {
  const reviewsListElement = reviewsListWrapperElement.querySelector('.reviews-list__items');
  const reviewsShowMoreButtonElement = reviewsListWrapperElement.querySelector('.reviews-list__button-wrapper .button');

  reviewsShowMoreButtonElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    reviewsListElement.insertAdjacentHTML(
      'beforeend',
      mockReviewsData.map(createReviewsListItemString).join('')
    );
  })
}

/* * * * * * * * * * * * * * * * * * * * * * * */
