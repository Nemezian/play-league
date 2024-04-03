import { useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateEmail as updateFirebaseEmail,
  updatePassword as updateFirebasePassword,
} from "firebase/auth"
import { auth, firestore } from "../firebase"
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore"

export function useFirebaseAuth() {
  const [currentUser, setCurrentUser] = useState()
  const [userInfos, setUserInfos] = useState()
  const [loading, setLoading] = useState(true)

  const signup = (email, password, firstName, lastName) =>
    createUserWithEmailAndPassword(auth, email, password).then(
      async (result) => {
        const user = result.user
        const ref = doc(firestore, "users", result.user.uid)
        const docData = {
          email: user.email,
          firstName,
          lastName,
          role: "player",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await setDoc(ref, docData)
          .then(() => {
            console.log("Document successfully written!")
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      }
    )

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const updateEmail = (email) => updateFirebaseEmail(currentUser, email)

  const updatePassword = (password) =>
    updateFirebasePassword(currentUser, password).then(async () => {
      const ref = doc(firestore, "users", currentUser.uid)
      const docData = {
        updatedAt: new Date(),
      }
      await setDoc(ref, docData, { merge: true })
        .then(() => {
          console.log("Document successfully written!")
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
    })

  const getUserInfo = async (userId) => {
    const docRef = doc(firestore, "users", userId)
    const mySnapshot = await getDoc(docRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      console.log("Document data: ", docData)
      return docData
    } else {
      console.log("No such document!")
      return null
    }
  }

  const getUserRole = async (userId) => {
    const docRef = doc(firestore, "users", userId)
    const mySnapshot = await getDoc(docRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      console.log("Document data: ", docData)
      return docData.role
    } else {
      console.log("No such document!")
      return null
    }
  }

  const getLeagues = async () => {
    const querySnapshot = await getDocs(collection(firestore, "leagues"))
    const fetchedLeagues = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return fetchedLeagues
  }

  const createLeague = async (leagueName, leagueDescription) => {
    const ref = doc(firestore, "leagues")
    const docData = {
      leagueName,
      leagueDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await setDoc(ref, docData)
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  const createTeam = async (teamName, teamDescription, leagueId) => {
    const ref = collection(firestore, "leagues", leagueId, "teams")
    console.log("createTeam: ", ref)
    const docData = {
      teamName,
      teamDescription,
      captain: doc(firestore, "users", currentUser.uid),
      players: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    console.log("createTeamData: ", docData)
    await addDoc(ref, docData)
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      getUserInfo(currentUser.uid).then((info) => setUserInfos(info))
    }
  }, [currentUser])

  return {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getUserInfo,
    getLeagues,
    createLeague,
    createTeam,
    getUserRole,
    userInfos,
  }
}
