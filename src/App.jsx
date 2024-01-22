import { BrowserRouter, Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import RemindMePage from "./pages/RemindMePage"
import HomePage from "./pages/HomePage"

function App() {
  return (
    // <div className="min-h-full h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    //   <div className="max-w-md w-full">
    <div>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reminder" element={<RemindMePage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
