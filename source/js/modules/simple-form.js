/* * * * * * * * * * * * * * * * * * * * * * * *
 * simple-form.js
 */
function initSimpleForm(formElement) {
  const fieldElement = formElement.querySelector('.simple-form__control');
  const clearButtonElement = formElement.querySelector('.simple-form__button--clear');

  const updateEmptyStatus = () => {
    formElement.classList.toggle('simple-form--empty', !fieldElement.value);
  };

  updateEmptyStatus();

  formElement.addEventListener('input', () => {
    updateEmptyStatus();
  });

  clearButtonElement.addEventListener('click', () => {
    fieldElement.value = '';
    updateEmptyStatus();
    fieldElement.focus();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
