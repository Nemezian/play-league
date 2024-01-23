import { BrowserRouter, Routes, Route } from "react-router-dom"
import { routes } from "./constants/routeNavLinks"

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  )
}
