/* * * * * * * * * * * * * * * * * * * * * * * *
 * form.js
 */
class Form extends PubSub {
  constructor(formElement) {
    super();
    this.formElement = formElement;
    this.textFieldControlElements = this.formElement.querySelectorAll('.text-field__control, .simple-form__control, .text-area__control');
    this.imagesFieldElement = this.formElement.querySelector('.images-field');
    this.imagesFieldListElement = this.formElement.querySelector('.images-field__list');
    this.actionUrl = this.formElement.action;
    this.submitButtonElement = this.formElement.querySelector('[data-submit-button]');
    this.validator = new FormValidator(this.formElement);
    this.siteHeaderElement = document.querySelector('.page__site-header');
    this.successHandler = null;
    this.errorHandler = null;
    this.imagesFieldErrorTextElement = null;
    this.init();
  }

  setHandlers = (successHandler, errorHandler) => {
    this.successHandler = successHandler;
    this.errorHandler = errorHandler;
  };

  resetImagesField = () => {
    if (this.imagesFieldListElement) {
      this.imagesFieldListElement.querySelectorAll('img').forEach((imageElement) => {
        URL.revokeObjectURL(imageElement.src);
      });

      this.imagesFieldListElement.innerHTML = '';
    }

    if (this.images) {
      this.images.clear();
    }
  };

  initImagesField = (fieldElement) => {
    const controlElement = fieldElement.querySelector('.images-field__control');
    const listElement = fieldElement.querySelector('.images-field__list');
    this.images = new Set();

    controlElement.addEventListener('change', (evt) => {
      this.imagesFieldErrorTextElement?.remove();
      const newFiles = Array.from(evt.target.files);
      newFiles.forEach((file) => {
        if (file.type.startsWith('image/') && PHOTO_TYPES.some((it) => file.name.toLowerCase().endsWith(it))) {
          this.images.add(file);
        } else {
          this.imagesFieldErrorTextElement = createElementByString(`<p class="images-field__error-text">Не удалось загрузить фото, попробуйте снова</p>`);
          listElement.insertAdjacentElement('beforebegin', this.imagesFieldErrorTextElement);
        }
      });

      updateList();
    });

    const updateList = () => {
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
          this.images.delete(file);
          updateList();
          URL.revokeObjectURL(previewElement.src);
        });

        fragment.append(listItemElement);
      });

      listElement.innerHTML = '';
      listElement.append(fragment);
    };
  };


  init = () => {
    if (this.imagesFieldElement) {
      this.initImagesField(this.imagesFieldElement);
    }

    this.formElement.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const isValid = this.validator.validate();

      if (isValid) {
        console.log('Форма валидна')

        this.emit(FormEvents.SUBMIT_START);
        this.submitButtonElement.disabled = true;
        this.submitButtonElement.classList.add('button--pending');

        const formData = new FormData(evt.target);
        this.images?.forEach((file) => {
          formData.append('images[]', file);
        });

        sendData(
          this.actionUrl,
          formData,
          (data) => {
            this.successHandler(data);

            if (!this.formElement.matches('.modal-entry__form--code')) {
              this.formElement.reset();
            }
          },
          (data) => {
            this.errorHandler(data);
          },
          () => {
            this.emit(FormEvents.SUBMIT_END);
            this.submitButtonElement.disabled = false;
            this.submitButtonElement.classList.remove('button--pending');
          }
        );
      } else {
        console.log('Форма невалидна')

        if (this.formElement.matches('.simple-form')) {
          const fieldWrapperElement = this.formElement.querySelector('.simple-form__inner');
          fieldWrapperElement.classList.remove('shake');
          requestAnimationFrame(() => fieldWrapperElement.classList.add('shake'));
          fieldWrapperElement.querySelector('input').focus();
        } else {
          const firstInvalidItemElement = this.formElement.querySelector('.pristine-item--invalid');
          const modalElement = firstInvalidItemElement?.closest('.modal');

          if (modalElement) {
            modalElement.scrollTo({
              top: firstInvalidItemElement.offsetTop,
              behavior: 'smooth',
            })
          } else {
            window.scrollTo({
              top: firstInvalidItemElement.offsetTop - this.siteHeaderElement.offsetHeight,
              behavior: 'smooth',
            })
          }


          firstInvalidItemElement.querySelector('input, textarea').focus();
          firstInvalidItemElement.classList.remove('shake');
          requestAnimationFrame(() => firstInvalidItemElement.classList.add('shake'));
        }
      }
    });

    this.formElement.addEventListener('reset', () => {
      setTimeout(() => {
        this.textFieldControlElements?.forEach((textFieldElement) => {
          textFieldElement.dispatchEvent(inputEvent);
        });
        this.resetImagesField();
        this.validator.reset();
      }, 0)
    });
  };
}
