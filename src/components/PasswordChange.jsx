import { useRef, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

import { changePasswordFields } from "../constants/formFields"
import Alert from "./Alert"
import Input from "./Input"
import FormAction from "./FormAction"

const fields = changePasswordFields
let fieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ""))

export default function PasswordChange() {
  const passwordRef = useRef()
  const newPasswordRef = useRef()
  const newPasswordConfirmRef = useRef()
  const { updatePassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [changePasswordState, setChangePasswordState] = useState(fieldsState)

  async function handleSubmit(e) {
    e.preventDefault()

    if (newPasswordRef.current.value !== newPasswordConfirmRef.current.value) {
      return setError("Nowe hasła nie są takie same")
    }
    if (
      passwordRef.current.value.length < 6 ||
      newPasswordRef.current.valuelength < 6
    ) {
      return setError("Hasło musi mieć co najmniej 6 znaków")
    }

    setError("")
    setMessage("")
    setLoading(true)

    updatePassword(newPasswordRef.current.value.trim())
      .then(() => {
        setMessage("Pomyślnie zmieniono hasło")
      })
      .catch((e) => {
        setError("Niepomyślna próba zmiany hasła")
        console.error("An error occurred while signing up", e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (e) => {
    setChangePasswordState({
      ...changePasswordState,
      [e.target.id]: e.target.value,
    })
  }

  return (
    <div>
      {error && (
        <Alert message={error} type="error">
          {error}
        </Alert>
      )}
      {message && (
        <Alert message={message} type="success">
          {message}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={changePasswordState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            customClass={field.customClass}
            isRequired={field.isRequired}
            ref={
              field.id === "old-password"
                ? passwordRef
                : field.id === "new-password"
                  ? newPasswordRef
                  : field.id === "confirm-new-password"
                    ? newPasswordConfirmRef
                    : null
            }
            placeholder={field.placeholder}
          />
        ))}
        <FormAction disabled={loading} text="Aktualizuj" />
      </form>
    </div>
  )
}
