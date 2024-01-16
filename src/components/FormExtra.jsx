export default function FormExtra() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember_me"
          name="remember_me"
          type="checkbox"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label
          htmlFor="remember_me"
          className="ml-2 block text-sm text-gray-900"
        >
          Zapamiętaj hasło
        </label>
      </div>

      <div className="text-sm">
        <a
          href="reminder"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Zapomniałeś hasła?
        </a>
      </div>
    </div>
  )
}
