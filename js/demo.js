"use strict";callbackModalForm&&callbackModalForm.setHandlers((t=>{showAlert({heading:"Ваша заявка успешно отправлена",text:"Наш менеджер свяжется с вам в течение дня",buttonText:"Закрыть"})}),(t=>{showAlert({heading:"Ошибка",status:"error",text:"Не удалось отправить заявку",buttonText:"Повторить"})})),requestForm&&requestForm.setHandlers((t=>{showAlert({heading:"Ваша заявка успешно отправлена",text:"Наш менеджер свяжется с вам в течение дня",buttonText:"Закрыть"})}),(t=>{showAlert({heading:"Ошибка",status:"error",text:"Не удалось отправить заявку",buttonText:"Повторить"})})),subscriptionForm&&subscriptionForm.setHandlers((t=>{showAlert({heading:"Спасибо за подписку",text:"Вы успешно подписались на email рассылку",buttonText:"Закрыть"})}),(t=>{showAlert({heading:"Ошибка",status:"error",text:"Не удалось подписаться на рассылку",buttonText:"Повторить"})})),reviewModalForm&&reviewModalForm.setHandlers((t=>{showAlert({heading:"Спасибо, что оценили нашу работу",mode:"alter",text:"Ваш отзыв будет проверен модератором сайта, и опубликован в течение 2 рабочих дней",buttonText:"Закрыть"})}),(t=>{showAlert({heading:"Ошибка",status:"error",text:"Не удалось отправить заявку",buttonText:"Повторить"})}));let cartModalAlert=null;const cartModalAlertElement=document.querySelector(".modal--with_cart-alert");cartModalAlertElement&&(cartModalAlert=new Modal(cartModalAlertElement)),document.addEventListener("click",(t=>{const e=t.target.closest("[data-product-cart-button]");cartModalAlert&&e&&cartModalAlert.open()})),cart?.form&&cart.form.setHandlers((t=>{window.location.href="https://umnyash.github.io/truckstar/order.html"}),(t=>{showAlert({heading:"Ошибка",status:"error",text:"Не удалось отправить заказ",buttonText:"Повторить"})}));