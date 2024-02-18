import { Link } from "react-router-dom"

export default function FormExtra() {
  return (
    <div className="flex items-center justify-between  max-w-xl mx-auto w-3/5">
      {/* <div className="flex items-center">
        <input
          id="remember_me"
          name="remember_me"
          type="checkbox"
          className="h-4 w-4 text-fourth focus:ring-third border-gray-300 rounded"
        />
        <label htmlFor="remember_me" className="ml-2 block text-sm text-white">
          Zapamiętaj hasło
        </label>
      </div> */}

      <div className="text-sm mx-auto">
        <Link
          to={"/remindme"}
          className="font-medium text-fourth hover:text-third"
        >
          Zapomniałeś hasła?
        </Link>
      </div>
    </div>
  )
}
