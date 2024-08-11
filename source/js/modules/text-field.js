/* * * * * * * * * * * * * * * * * * * * * * * *
 * text-field.js
 */
function initTextField(fieldElement) {
  const controlElement = fieldElement.querySelector('.text-field__control');
  const clearButtonElement = fieldElement.querySelector('.text-field__button--clear');

  const updateEmptyStatus = () => {
    setTimeout(() => {
      fieldElement.classList.toggle('text-field--empty', !controlElement.value);
    })
  };

  updateEmptyStatus();

  controlElement.addEventListener('input', () => {
    updateEmptyStatus();
  });

  clearButtonElement.addEventListener('click', () => {
    controlElement.value = '';
    updateEmptyStatus();
    controlElement.focus();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
