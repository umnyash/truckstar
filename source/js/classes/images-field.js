/* * * * * * * * * * * * * * * * * * * * * * * *
 * images-field.js
 */
class ImagesField {
  constructor(imagesFieldElement) {
    this.element = imagesFieldElement;
    this.controlElement = this.element.querySelector('.images-field__control');
    this.listElement = this.element.querySelector('.images-field__list');
    this.errorTextElement = null;
    this.images = new Set();
    this.init();
  }

  updateList = () => {
    const fragment = document.createDocumentFragment();

    this.images.forEach((file) => {
      const listItemElement = createElementByString(`
        <li class="images-field__list-item">
          <img class="images-field__preview" src=${URL.createObjectURL(file)} alt=''>
          <button class="images-field__delete-button image-button image-button--size_xs image-button--primary image-button--icon_cross" type="button">
            <span class="visually-hidden">Удалить фото</span>
          </button>
        </li>
      `);

      const previewElement = listItemElement.querySelector('.images-field__preview');
      const deleteButtonElement = listItemElement.querySelector('.images-field__delete-button');

      deleteButtonElement.addEventListener('click', (evt) => {
        evt.preventDefault();

        this.images.delete(file);
        this.updateList();
        URL.revokeObjectURL(previewElement.src);
      });

      fragment.append(listItemElement);
    });

    this.listElement.innerHTML = '';
    this.listElement.append(fragment);
  };

  onControlChange = (evt) => {
    this.errorTextElement?.remove();
    const newFiles = Array.from(evt.target.files);
    newFiles.forEach((file) => {
      if (file.type.startsWith('image/') && PHOTO_TYPES.some((it) => file.name.toLowerCase().endsWith(it))) {
        this.images.add(file);
      } else {
        this.errorTextElement = createElementByString(`<p class="images-field__error-text">Не удалось загрузить фото, попробуйте снова</p>`);
        this.listElement.insertAdjacentElement('beforebegin', this.errorTextElement);
      }
    });

    this.updateList();
  };

  reset = () => {
    this.listElement.querySelectorAll('img').forEach((imageElement) => {
      URL.revokeObjectURL(imageElement.src);
    });
    this.errorTextElement?.remove();
    this.listElement.innerHTML = '';
    this.images.clear();
  }

  init = () => {
    this.controlElement.addEventListener('change', this.onControlChange);
  };
}
/* * * * * * * * * * * * * * * * * * * * * * * */
