import { SignupPage, LoginPage, RemindMePage, HomePage } from "../pages"

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/reminder", element: <RemindMePage /> },
]

export { routes }
