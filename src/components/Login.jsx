import { useState } from "react"
import { loginFields } from "../constants/formFields"
import FormAction from "./FormAction"
import FormExtra from "./FormExtra"
import Input from "./Input"

const fields = loginFields
let fieldsState = {}
fields.forEach((field) => (fieldsState[fields.id] = ""))

export default function Login() {
  const [loginState, setLoginState] = useState(fieldsState)

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    authenticateUser()
  }

  const authenticateUser = () => {
    console.log("User authenticated")
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="-space-y-px">
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
            className={field.className}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Zaloguj się" />
    </form>
  )
}
