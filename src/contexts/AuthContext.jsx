import React, { useContext } from "react"
import { useFirebaseAuth } from "../customHooks/useFirebaseAuth"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const auth = useFirebaseAuth()

  return (
    <AuthContext.Provider value={auth}>
      {!auth.loading && children}
    </AuthContext.Provider>
  )
}
