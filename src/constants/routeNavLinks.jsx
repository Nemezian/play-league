import { PrivateRoute } from "../components"
import {
  SignupPage,
  LoginPage,
  RemindMePage,
  HomePage,
  DashboardPage,
  TeamCreationPage,
  TeamJoinPage,
  TeamManagementPage,
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
  {
    path: "/team-creation",
    element: (
      <PrivateRoute>
        <TeamCreationPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-management",
    element: (
      <PrivateRoute>
        <TeamManagementPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-join",
    element: (
      <PrivateRoute>
        <TeamJoinPage />
      </PrivateRoute>
    ),
  },
  // { path: "*", element: <PageNotFound /> },
]

export { routes }
