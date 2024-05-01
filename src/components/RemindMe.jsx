import { useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { reminderFields } from "../constants/formFields"
import FormAction from "./FormAction"
import Input from "./Input"
import Alert from "./Alert"

const fields = reminderFields
let fieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ""))

export default function RemindMe() {
  const emailRef = useRef()
  const [reminderState, setRemindState] = useState(fieldsState)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleChange = (e) => {
    setRemindState({ ...reminderState, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setError("")
    setMessage("")
    setLoading(true)

    resetPassword(emailRef.current.value)
      .then(() => {
        setMessage("Wysłano e-mail z przypomnieniem")
      })
      .catch((e) => {
        setError("Nie udało się wysłać e-maila")
        console.error("An error occurred while sending the email", e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex flex-col justify-center items-center">
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
      <form className="mt-3 w-full space-y-6 " onSubmit={handleSubmit}>
        <div>
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={reminderState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              customClass={field.customClass}
              isRequired={field.isRequired}
              ref={field.id === "email-address" ? emailRef : null}
              placeholder={field.placeholder}
            />
          ))}
        </div>
        <FormAction disabled={loading} text="Wyślij e-mail" />
      </form>
    </div>
  )
}
