import JustValidate from 'just-validate';
import JustValidatePluginDate from 'just-validate-plugin-date';
import { isValid } from 'creditcard.js';

export default function addFormValidationRules(form) {
  const validator = new JustValidate(`#${form.id}`, {
    validateBeforeSubmitting: true,
    errorFieldCssClass: ['is-invalid'],
    errorLabelStyle: {
      fontSize: '10px',
      color: '#b81111',
    },
  });

  validator.addField('#card-number', [
    {
      rule: 'required',
    },
    {
      validator: (value) => Boolean(isValid(value)),
      errorMessage: 'Enter valid card number',
    },
  ])
    .addField('#card-expiry-date', [
      {
        rule: 'required',
        errorMessage: 'Expiry date is required',
      },
      {
        plugin: JustValidatePluginDate(() => ({
          format: 'MM/yy',
          isAfter: new Date(),
        })),
        errorMessage: 'Date should be valid',
      },
    ])
    .addField('#card-cvc', [
      {
        rule: 'required',
        errorMessage: 'Card number is required',
      },
      {
        rule: 'minLength',
        value: 3,
      },
      {
        rule: 'number',
      },
      {
        rule: 'maxLength',
        value: 3,
      },
    ])
    .addField('#card-email', [
      {
        rule: 'required',
        errorMessage: 'Email is required',
      },
      {
        rule: 'email',
        errorMessage: 'Email is invalid!',
      },
    ]);
}
