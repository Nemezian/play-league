import { PrivateRoute } from "../components"
import {
  SignupPage,
  LoginPage,
  RemindMePage,
  HomePage,
  DashboardPage,
} from "../pages"

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/remindme", element: <RemindMePage /> },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },
  // { path: "*", element: <PageNotFound /> },
]

export { routes }
