export default function FormAction({
  disabled = false,
  type = "Button",
  action = "submit",
  text,
}) {
  return (
    <>
      {type === "Button" ? (
        <button
          disabled={disabled}
          type={action}
          className="group relative w-3/5 max-w-xl mx-auto flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fourth hover:bg-third focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fourth mt-10"
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  )
}
