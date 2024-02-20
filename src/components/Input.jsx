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
    "rounded-lg appearance-none  mb-2 block w-full p-1.5 md:p-2.5 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-fourth focus:border-fourth focus:z-10 sm:text-sm"

  return (
    <div>
      <label
        className="block mb-2 text-xs font-medium text-white"
        htmlFor={labelFor}
      >
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
        className={`${customClass} ${fixedInputClass}`}
        placeholder={placeholder}
      />
    </div>
  )
})
export default Input
