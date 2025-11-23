document.addEventListener("DOMContentLoaded", function () {
    initForm('member-form');
    initForm('startup-form');
    initForm('question-form');

    function initForm(formId) {
        const form = document.getElementById(formId);
        if (!form) return; // Если формы нет на странице, выходим

        const formItems = form.querySelectorAll(".form__item");
        const privacyCheckbox = form.querySelector('input[name="privacy-policy"]');
        const privacyError = form.querySelector(".form__item--checkbox .error-message");

        function clearErrors() {
            formItems.forEach((item) => {
                item.classList.remove("form__item--not-valid");
                const errorElement = item.querySelector(".error-message");
                if (errorElement) {
                    errorElement.style.display = "none";
                }
            });
        }

        function addError(element, message) {
            const formItem = element.closest(".form__item");
            formItem.classList.add("form__item--not-valid");

            const errorElement = formItem.querySelector(".error-message");
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = "block";
            } else {
                const newErrorElement = document.createElement("div");
                newErrorElement.className = "error-message";
                newErrorElement.textContent = message;
                formItem.appendChild(newErrorElement);
            }
        }

        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach(input => {
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
        });

        function handleInputFocus(e) {
            const formItem = e.target.closest(".form__item");
            if (formItem) {
                formItem.classList.add("form__item--focused");

                const label = formItem.querySelector("label");
                if (label) {
                    label.classList.add("label--focused");
                }
            }
        }

        function handleInputBlur(e) {
            const formItem = e.target.closest(".form__item");
            if (formItem) {
                formItem.classList.remove("form__item--focused");

                const label = formItem.querySelector("label");
                if (label) {
                    label.classList.remove("label--focused");
                }
            }
        }

        function validateField(field) {
            const value = field.value.trim();
            const name = field.name;

            if (field.type === "checkbox") {
                if (!field.checked) {
                    addError(field, "Необходимо ваше согласие");
                    return false;
                }
                return true;
            }

            if (!value) {
                addError(field, "Это поле обязательно для заполнения");
                return false;
            }

            switch (name) {
                case "taxId":
                    if (!/^\d{10,12}$/.test(value)) {
                        addError(field, "ИНН должен содержать 10 или 12 цифр");
                        return false;
                    }
                    break;
                case "email":
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        addError(field, "Введите корректный email");
                        return false;
                    }
                    break;
                case "phone":
                    if (!/^[\d\+][\d\(\)\ -]{4,14}\d$/.test(value)) {
                        addError(field, "Введите корректный номер телефона");
                        return false;
                    }
                    break;
                case "site":
                    if (!/^https?:\/\/.+\..+/.test(value)) {
                        addError(field, "Введите корректный URL сайта");
                        return false;
                    }
                    break;
                case "presentation":
                    if (!/^https?:\/\/.+/.test(value)) {
                        addError(field, "Введите корректную ссылку на презентацию");
                        return false;
                    }
                    break;
            }

            return true;
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            clearErrors();

            let isValid = true;
            const fields = form.querySelectorAll("input:not([type=submit]), textarea");

            fields.forEach((field) => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });

            // Проверяем чекбокс приватности только если он есть в форме
            if (privacyCheckbox && !privacyCheckbox.checked) {
                addError(privacyCheckbox, "Необходимо ваше согласие");
                isValid = false;
            }

            if (isValid) {
                const formType = getFormType(formId);
                const formData = collectFormData(form, formType);

                console.log(`Данные формы ${formType}:`, formData);

                showModal(
                    getSuccessTitle(formId),
                    getSuccessMessage(formId),
                    "Хорошо"
                );

                // Очистка формы после успешной отправки
                form.reset();
            }
        });

        function getFormType(formId) {
            switch(formId) {
                case 'member-form': return 'участника';
                case 'startup-form': return 'стартапа';
                case 'question-form': return 'вопроса';
                default: return '';
            }
        }

        function getSuccessTitle(formId) {
            switch(formId) {
                case 'member-form': 
                case 'startup-form': 
                    return "Регистрация прошла успешно";
                case 'question-form': 
                    return "Вопрос отправлен";
                default: return "Успешно";
            }
        }

        function getSuccessMessage(formId) {
            switch(formId) {
                case 'member-form': 
                    return "Ваша заявка участника принята. Мы свяжемся с вами в ближайшее время";
                case 'startup-form': 
                    return "Ваша заявка стартапа принята. Мы свяжемся с вами в ближайшее время";
                case 'question-form': 
                    return "Ваш вопрос принят. Мы ответим на него в ближайшее время";
                default: return "Данные успешно отправлены";
            }
        }

        function collectFormData(form, formType) {
            const baseData = {
                name: form.elements.name?.value.trim() || '',
                email: form.elements.email?.value.trim() || '',
                phone: form.elements.phone?.value.trim() || '',
                company: form.elements.company?.value.trim() || '',
                job: form.elements.job?.value.trim() || '',
                privacyPolicy: form.elements["privacy-policy"]?.checked || false,
            };

            if (formType === 'участника') {
                baseData.taxId = form.elements.taxId?.value.trim() || '';
            } else if (formType === 'стартапа') {
                baseData.site = form.elements.site?.value.trim() || '';
                baseData.presentation = form.elements.presentation?.value.trim() || '';
            } else if (formType === 'вопроса') {
                baseData.question = form.elements.question?.value.trim() || '';
            }

            return baseData;
        }

        // Добавляем обработчик для чекбокса приватности только если он есть
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener("change", function () {
                if (this.checked) {
                    this.closest(".form__item").classList.remove("form__item--not-valid");
                    if (privacyError) privacyError.style.display = "none";
                }
            });
        }

        form.addEventListener("input", function (e) {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
                const formItem = e.target.closest(".form__item");
                formItem.classList.remove("form__item--not-valid");
                const errorElement = formItem.querySelector(".error-message");
                if (errorElement) {
                    errorElement.style.display = "none";
                }
            }
        });
    }

    function showModal(title, text, buttonText) {
        const modal = document.querySelector(".modal");
        const modalWindow = modal.querySelector(".modal__window");
        const modalHeadline = modal.querySelector(".modal__headline");
        const modalText = modal.querySelector(".modal__text");
        const modalButton = modal.querySelector(".modal__button");
        const modalClose = modal.querySelector(".modal__close");

        modalHeadline.textContent = title;
        modalText.textContent = text;
        modalButton.textContent = buttonText;

        modal.style.display = "flex";

        modalWindow.classList.add("animate__fadeInUp");
        modal.classList.add("animate__fadeIn");

        function closeModal() {
            modalWindow.classList.remove("animate__fadeInUp");
            modalWindow.classList.add("animate__fadeOutDown");
            modal.classList.remove("animate__fadeIn");
            modal.classList.add("animate__fadeOut");

            setTimeout(() => {
                modal.style.display = "none";
                modalWindow.classList.remove("animate__fadeOutDown");
                modal.classList.remove("animate__fadeOut");

                modalHeadline.textContent = "";
                modalText.textContent = "";
                modalButton.innerHTML = '';
            }, 500);
        }

        // Удаляем старые обработчики и добавляем новые
        const newModalButton = modalButton.cloneNode(true);
        modalButton.parentNode.replaceChild(newModalButton, modalButton);

        newModalButton.addEventListener("click", closeModal);
        modalClose.addEventListener("click", closeModal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
});