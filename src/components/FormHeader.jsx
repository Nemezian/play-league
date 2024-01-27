import { Link } from "react-router-dom"

export default function FormHeader({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}) {
  return (
    <div className="mb-10">
      <div className="flex justify-center">
        <img alt="" className="h-14 w-14" src="src/assets/logo_L1.png" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
        {heading}
      </h2>
      <p className="text-center text-sm text-white mt-5 font-Roboto">
        {paragraph}{" "}
        <Link to={linkUrl} className="font-medium text-fourth hover:text-third">
          {linkName}
        </Link>
      </p>
    </div>
  )
}
