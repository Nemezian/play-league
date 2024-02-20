import { Link } from "react-router-dom"

export default function FormHeader({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) {
  return (
    <div className="w-full flex flex-col mb:2 md:mb-5">
      <div className="mb-6 flex justify-center items-center">
        <img
          alt="logo.png"
          className="h-14 w-14 mr-3"
          src="src/assets/logo_L1.png"
        />
        <h2 className="text-center text-3xl font-extrabold text-white">
          {heading}
        </h2>
      </div>
      <div className="mb-2">
        <p className="text-center text-sm text-white font-Roboto">
          {paragraph}{" "}
          <Link
            to={linkUrl}
            className="font-medium text-fourth hover:text-third"
          >
            {linkName}
          </Link>
        </p>
      </div>
    </div>
  )
}
