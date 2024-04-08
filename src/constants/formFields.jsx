const loginFields = [
  {
    labelText: "Adres e-mail",
    labelFor: "email-address",
    id: "email-address",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "E-mail",
  },
  {
    labelText: "Hasło",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "*************",
  },
]

const signupFields = [
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
    labelText: "Adres e-mail",
    labelFor: "email-address",
    id: "email-address",
    name: "email",
    type: "email",
    autoComplete: "email",
    isRequired: true,
    placeholder: "E-mail",
  },
  {
    labelText: "Hasło",
    labelFor: "password",
    id: "password",
    name: "password",
    type: "password",
    autoComplete: "current-password",
    isRequired: true,
    placeholder: "*************",
  },
  {
    labelText: "Potwierdź hasło",
    labelFor: "confirm-password",
    id: "confirm-password",
    name: "confirm-password",
    type: "password",
    autoComplete: "confirm-password",
    isRequired: true,
    placeholder: "*************",
  },
]

const changePasswordFields = [
  {
    labelText: "Stare hasło",
    labelFor: "old-password",
    id: "old-password",
    name: "old-password",
    type: "password",
    autoComplete: "false",
    isRequired: true,
    placeholder: "Wprowadź stare hasło",
  },
  {
    labelText: "Nowe hasło",
    labelFor: "new-password",
    id: "new-password",
    name: "new-password",
    type: "password",
    autoComplete: "false",
    isRequired: true,
    placeholder: "Nowe hasło",
  },
  {
    labelText: "Potwierdź nowe hasło",
    labelFor: "confirm-new-password",
    id: "confirm-new-password",
    name: "confirm-new-password",
    type: "password",
    autoComplete: "false",
    isRequired: true,
    placeholder: "Potwierdź nowe hasło",
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

const teamCreationFields = [
  {
    labelText: "Nazwa drużyny",
    labelFor: "team-name",
    id: "team-name",
    name: "team-name",
    type: "text",
    autoComplete: "false",
    isRequired: true,
    placeholder: "Nazwa drużyny",
  },
  {
    labelText: "Kod dołączenia",
    labelFor: "team-code",
    id: "team-code",
    name: "team-code",
    type: "text",
    autoComplete: "false",
    isRequired: true,
    placeholder: "Wprowadź kod dołączenia do drużyny",
  },
]

export {
  loginFields,
  signupFields,
  changePasswordFields,
  reminderFields,
  teamCreationFields,
}
