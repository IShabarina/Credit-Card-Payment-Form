import './styles.scss';
import * as bootstrap from 'bootstrap';
import { el, setChildren } from 'redom';
import Inputmask from 'inputmask';
import Payment from 'payment';
import addFormValidationRules from './validation.js';

// import card's logos using 'require.context':
function importAll(r) {
  let images = {};
  r.keys().map((item) => { images[item.replace('./', '').replace(/\..+/, '')] = r(item); });
  return images;
}
const cardTypeImgs = importAll(require.context('./assets/images', false, /\.(png|jpe?g|svg)$/));

// create PaymentForm using REDOM:
function createCardPaymentForm() {
  const cardForm = el('form#card-form', { method: 'post', style: 'max-width: 751px;' });

  const cardNumberRow = el('.row', { style: 'position: relative' },
    el('.col-md-12', [
      el('span.help-block.text-muted.small-font', { style: 'font-size: 9px;' }, 'Card Number'),
      el('input.form-control#card-number', {
        type: 'text', placeholder: 'Enter card number', autocomplete: 'off', name: 'number',
      })], el('span.card-type-logo#card-type', { style: 'position: absolute; height: 28px; width: 44px; top: 29px; right: 55px; background-size: cover;' })));

  const cardDateCvcRow = el('.row.mb-3.justify-content-between', [
    el('.col-4', [
      el('span.help-block.text-muted.small-font', { style: 'font-size: 9px;' }, 'Expiry Month/Year'),
      el('input.form-control#card-expiry-date', { type: 'text', placeholder: 'MM/YY', autocomplete: 'off', name: 'date' }),
    ]),
    el('.col-4', [
      el('span.help-block.text-muted.small-font', { style: 'font-size: 9px;' }, 'CVC/CVV'),
      el('input.form-control#card-cvc', { type: 'text', placeholder: 'CVC/CVV', autocomplete: 'off', name: 'cvc' }),
    ]),
  ]);
  const cardEmailRow = el('.row.mb-3', el('.col-12', [
    el('span.help-block.text-muted.small-font', { style: 'font-size: 9px;' }, 'Email'),
    el('input.form-control#card-email', { type: 'email', placeholder: 'name@example.com' }),
  ]));
  const cardBtnSubmitRow = el('.row', el('.col-12', el('button.btn.btn-warning#card-btn-submit.col-12', { type: 'submit', disabled: 'true' }, 'Pay')));

  setChildren(cardForm, [cardNumberRow, cardDateCvcRow, cardEmailRow, cardBtnSubmitRow]);
  return cardForm;
}

// add PaymentForm to DOM:
const sectionPayment = el('section.section-payment.p-3', el('.container.text-bg-light.p-3', el('.row', el('.col-md-4.col-md-offset-4#form-container', [createCardPaymentForm()]))));
setChildren(window.document.body, sectionPayment);

const cardForm = document.querySelector('#card-form');
const cardNumberField = document.getElementById('card-number');
const cardTypeElem = document.getElementById('card-type');
const cardExpDateField = document.getElementById('card-expiry-date');
const cardSubmitBtn = document.getElementById('card-btn-submit');

// adding masks using Inputmask:
Inputmask({ "mask": "9999 9999 9999 9999 [99]" }).mask(cardNumberField);
Inputmask({ "mask": "99/99" }).mask(cardExpDateField);

// adding card type logo to page:
function showHideCardTypeLogo(input, logoElem) {
  let cardType = Payment.fns.cardType(input.inputmask.unmaskedvalue());
  if (cardType) {
    logoElem.style.backgroundSize = 'cover';
    logoElem.style.backgroundImage = `url('${cardTypeImgs[cardType]}')`;
  } else {
    logoElem.style.background = 'none';
  }
}

// check if all Inputs are valid:
function inputsValidationSuccess(form) {
  let result = true;
  const allInputs = form.querySelectorAll('input');
  for (const input of allInputs) {
    if (input.parentElement.querySelector('.just-validate-error-label')) {
      result = false;
      return result;
    }
  }
  return result;
}

// check if all Inputs are filled:
function inputsFullnessSuccess(form) {
  let allInputs = form.querySelectorAll('input');
  for (const input of allInputs) {
    if (!input.value) return false;
  }
  return true;
}

// change Error visibility:
function showHideErrorLabel(input) {
  let errorBlock = input.parentElement.querySelector('.just-validate-error-label');
  if (errorBlock) {
    if (errorBlock.style.display != 'none') {
      errorBlock.style.display = 'none';
      input.classList.remove('is-invalid');
    } else {
      errorBlock.style.display = 'block';
      input.classList.add('is-invalid');
    }
  }
}

// main function for handling PaymentForm:
function handleCardPaymentForm(form) {
  addFormValidationRules(form);
  const formElements = Array.from(form.elements);

  formElements.forEach((element) => {
    element.addEventListener('input', (event) => {
      // during value change hide error message:
      showHideErrorLabel(event.target);

      // activate Pay button once all fields validated and fullfillness:
      if (inputsValidationSuccess(form) && inputsFullnessSuccess(form)) {
        cardSubmitBtn.removeAttribute('disabled');
      } else cardSubmitBtn.setAttribute('disabled', 'disabled');

      // show logo of payment system:
      if (event.target.id === 'card-number') {
        showHideCardTypeLogo(event.target, cardTypeElem);
      }
    });

    // show error messages:
    element.addEventListener('blur', (event) => {
      showHideErrorLabel(event.target);
    });
  });
}

handleCardPaymentForm(cardForm);
