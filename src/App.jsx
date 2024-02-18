import { BrowserRouter, Routes, Route } from "react-router-dom"
import { routes } from "./constants/routeNavLinks"
import { AuthProvider } from "./contexts/AuthContext"
import { Footer, Nav } from "./components"

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Nav />
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}
