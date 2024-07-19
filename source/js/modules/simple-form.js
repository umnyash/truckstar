/* * * * * * * * * * * * * * * * * * * * * * * *
 * simple-form.js
 */
function initSimpleForm(formElement) {
  const fieldElement = formElement.querySelector('.simple-form__control');

  const updateEmptyStatus = () => {
    formElement.classList.toggle('simple-form--empty', !fieldElement.value);
  };

  updateEmptyStatus();

  formElement.addEventListener('input', () => {
    updateEmptyStatus();
  });

  formElement.addEventListener('reset', () => {
    setTimeout(updateEmptyStatus, 100);
    fieldElement.focus();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
