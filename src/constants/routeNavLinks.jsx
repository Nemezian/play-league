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
  TeamDashboardPage,
  PageNotFound,
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
      <PrivateRoute allowedRoles={["administrator", "player"]} navigateTo={"/"}>
        <TeamCreationPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-management",
    element: (
      <PrivateRoute
        allowedRoles={["administrator", "captain"]}
        // navigateTo={"/"}
      >
        <TeamManagementPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team-join",
    element: (
      <PrivateRoute allowedRoles={["administrator", "player"]} navigateTo={"/"}>
        <TeamJoinPage />
      </PrivateRoute>
    ),
  },
  {
    path: "/team/:teamId",
    element: (
      <PrivateRoute>
        <TeamDashboardPage />
      </PrivateRoute>
    ),
  },
  { path: "*", element: <PageNotFound /> },
]

export { routes }
