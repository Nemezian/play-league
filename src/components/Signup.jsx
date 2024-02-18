import { useState, useRef } from "react"
import { signupFields } from "../constants/formFields"
import FormAction from "./FormAction"
import Input from "./Input"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import Alert from "./Alert"

const fields = signupFields
let fieldsState = {}
fields.forEach((field) => (fieldsState[field.id] = ""))

export default function Signup() {
  const emailRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [signupState, setSignupState] = useState(fieldsState)

  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Hasła nie są takie same")
    }
    if (passwordRef.current.value.length < 6) {
      return setError("Hasło musi mieć co najmniej 6 znaków")
    }

    setError("")
    setLoading(true)
    signup(
      emailRef.current.value.trim(),
      passwordRef.current.value.trim(),
      firstNameRef.current.value.trim(),
      lastNameRef.current.value.trim()
    )
      .then(() => {
        navigate("/")
      })
      .catch((e) => {
        setError("Niepomyślna próba rejestracji")
        console.error("An error occurred while signing up", e)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChange = (e) => {
    setSignupState({ ...signupState, [e.target.id]: e.target.value })
  }

  return (
    <>
      {error && (
        <Alert message={error} type="error">
          {error}
        </Alert>
      )}
      <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
        <div className="-space-y-13">
          {fields.map((field) => (
            <div key={field.id} className="">
              <label
                className="flex flex-col w-3/5 max-w-xl mx-auto my-0"
                htmlFor={field.id}
              >
                {field.labelText}
              </label>
              <Input
                handleChange={handleChange}
                value={signupState[field.id]}
                labelFor={field.id}
                id={field.id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                customClass={field.customClass}
                isRequired={field.isRequired}
                ref={
                  field.id === "email-address"
                    ? emailRef
                    : field.id === "first-name"
                      ? firstNameRef
                      : field.id === "last-name"
                        ? lastNameRef
                        : field.id === "password"
                          ? passwordRef
                          : field.id === "confirm-password"
                            ? passwordConfirmRef
                            : null
                }
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
        <FormAction disabled={loading} text="Zarejestruj się" />
      </form>
    </>
  )
}
