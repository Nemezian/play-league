import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { loginFields } from "../constants/formFields"
import { useAuth } from "../contexts/AuthContext"
import FormAction from "./FormAction"
import FormExtra from "./FormExtra"
import Input from "./Input"
import Alert from "./Alert"

const fields = loginFields
let fieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ""))

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState)
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    setError("")
    setLoading(true)
    login(emailRef.current.value, passwordRef.current.value)
      .then(() => {
        navigate("/dashboard")
      })
      .catch((e) => {
        setError("Niepomyślna próba logowania")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value })
  }

  return (
    <>
      {error && (
        <Alert message={error} type="error">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            customClass={field.customClass}
            isRequired={field.isRequired}
            ref={
              field.id === "email-address"
                ? emailRef
                : field.id === "password"
                  ? passwordRef
                  : null
            }
            placeholder={field.placeholder}
          />
        ))}
        <FormExtra />
        <FormAction disabled={loading} text="Zaloguj się" />
      </form>
    </>
  )
}
