const Alert = ({ message, type, customClass = "" }) => {
  const alertStyles = {
    info: "w-3/5 max-w-xl mx-auto bg-blue-500 text-white p-3 rounded text-center",
    success:
      "w-3/5 max-w-xl mx-auto bg-green-500 text-white p-3 rounded text-center",
    error:
      "w-3/5 max-w-xl mx-auto bg-red-500 text-white p-3 rounded text-center",
  }

  return <div className={alertStyles[type] + " " + customClass}>{message}</div>
}

export default Alert
