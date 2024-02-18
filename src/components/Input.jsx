import React from "react"

const Input = React.forwardRef((props, ref) => {
  const {
    handleChange,
    value,
    labelText,
    labelFor,
    id,
    name,
    type,
    autoComplete,
    isRequired = false,
    placeholder,
    customClass,
  } = props

  const fixedInputClass =
    "rounded-md appearance-none w-3/5 max-w-xl mx-auto relative block px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  return (
    <div className="my-5">
      <label htmlFor={labelFor} className="sr-only">
        {labelText}
      </label>
      <input
        ref={ref}
        onChange={handleChange}
        value={value}
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={isRequired}
        className={`${fixedInputClass} ${customClass}`}
        placeholder={placeholder}
      />
    </div>
  )
})
export default Input
