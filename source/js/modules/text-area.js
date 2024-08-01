/* * * * * * * * * * * * * * * * * * * * * * * *
 * text-area.js
 */
function initTextArea(fieldElement) {
  const controlElement = fieldElement.querySelector('.text-area__control');

  const updateEmptyStatus = () => {
    fieldElement.classList.toggle('text-area--empty', !controlElement.value);
  };

  updateEmptyStatus();

  controlElement.addEventListener('input', () => {
    updateEmptyStatus();
  });
}
/* * * * * * * * * * * * * * * * * * * * * * * */
