const loginFields = [
  {
    labelText: "Adres e-mail",
    labelFor: "email-address",
    id: "email-address",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Adres e-mail",
  },
  {
    labelText: "Hasło",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Hasło",
  },
]

const signupFields = [
  {
    labelText: "Adres e-mail",
    labelFor: "email-address",
    id: "email-address",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Adres e-mail",
  },
  {
    labelText: "Imię",
    labelFor: "first-name",
    id: "first-name",
    name: "first-name",
    type: "text",
    autoComplete: "given-name",
    isRequired: true,
    placeholder: "Imię",
  },
  {
    labelText: "Nazwisko",
    labelFor: "last-name",
    id: "last-name",
    name: "last-name",
    type: "text",
    autoComplete: "family-name",
    isRequired: true,
    placeholder: "Nazwisko",
  },
  {
    labelText: "Hasło",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "Hasło",
  },
  {
    labelText: "Potwierdź hasło",
    labelFor: "confirm-password",
    id: "confirm-password",
    name: "confirm-password",
    type: "password",
    autoComplete: "confirm-password",
    isRequired: true,
    placeholder: "Potwierdź hasło",
  },
]

const reminderFields = [
  {
    labelText: "Adres e-mail",
    labelFor: "email-address",
    id: "email-address",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "Adres e-mail",
  },
]

export { loginFields, signupFields, reminderFields }
