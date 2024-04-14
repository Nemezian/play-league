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
  const [userInfoLoading, setUserInfoLoading] = useState(true)

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
          teamId: null,
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
    setUserInfoLoading(true)
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

  const getUserInfoByReference = async (userRef) => {
    const mySnapshot = await getDoc(userRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      console.log("Document data: ", docData)
      return docData
    } else {
      console.log("No such document!")
      return null
    }
  }

  const getMembersData = async (members) => {
    const membersData = []
    for (const member of members) {
      const mySnapshot = await getDoc(member)
      if (mySnapshot.exists()) {
        const docData = mySnapshot.data()
        membersData.push(docData)
      } else {
        console.log("No such document!")
      }
    }
    return membersData
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

  // Fetching all leagues for the user to choose from select box @TeamCreation
  const getLeagues = async () => {
    const querySnapshot = await getDocs(collection(firestore, "leagues"))
    const fetchedLeagues = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return fetchedLeagues
  }

  const getMemberTeamNameFromReference = async (teamDocRef) => {
    const mySnapshot = await getDoc(teamDocRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      console.log("Document data: ", docData)
      return docData
    } else {
      console.log("No such document!")
      return null
    }
  }

  const updateUserToCaptain = async (teamRefId, leagueId) => {
    const docRef = doc(firestore, "users", currentUser.uid)
    const docData = {
      role: "captain",
      teamId: doc(firestore, "leagues", leagueId, "teams", teamRefId),
      updatedAt: new Date(),
    }
    await setDoc(docRef, docData, { merge: true })
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  const createTeam = async (
    teamName,
    teamDescription,
    leagueId,
    joinPassword
  ) => {
    const teamColRef = collection(firestore, "leagues", leagueId, "teams")

    const docData = {
      teamName,
      teamDescription,
      joinPassword: joinPassword,
      captain: doc(firestore, "users", currentUser.uid),
      players: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await addDoc(teamColRef, docData)
      .then((result) => {
        updateUserToCaptain(result.id, leagueId)
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  const joinTeam = async (team, joinPasswordFromForm, leagueId) => {
    console.log(
      "team",
      team,
      "teamid",
      team.id,
      "joinPassword",
      joinPasswordFromForm,
      "leagueId",
      leagueId
    )
    const docRef = doc(firestore, "leagues", leagueId, "teams", team.id)
    const mySnapshot = await getDoc(docRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      if (docData.joinPassword === joinPasswordFromForm) {
        const userRef = doc(firestore, "users", currentUser.uid)
        console.log("Document data: ", docData, "Docdata id:", team.id)
        const userDocData = {
          role: "member",
          teamId: doc(firestore, "leagues", leagueId, "teams", team.id),
          updatedAt: new Date(),
        }
        await setDoc(userRef, userDocData, { merge: true })
          .then(() => {
            console.log("Document successfully written!")
            getUserInfo(currentUser.uid).then(
              (info) => setUserInfos(info),
              setUserInfoLoading(false)
            )
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })

        const teamDocRef = doc(firestore, "leagues", leagueId, "teams", team.id)
        const teamDocData = {
          players: [...docData.players, userRef],
          updatedAt: new Date(),
        }
        await setDoc(teamDocRef, teamDocData, { merge: true })
          .then(() => {
            console.log("Document successfully written!")
          })
          .catch((error) => {
            console.error("Error adding document: ", error)
          })
      }
    }
  }

  const getTeamData = async (leagueId, teamId) => {
    const teamDocRef = doc(firestore, "leagues", leagueId, "teams", teamId)
    const mySnapshot = await getDoc(teamDocRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      console.log("Document data: ", docData)
      return docData
    } else {
      console.log("No such document!")
      return null
    }
  }

  const getTeamsByLeagueId = async (leagueId, searchQuery = "") => {
    const querySnapshot = await getDocs(
      collection(firestore, "leagues", leagueId, "teams")
    )
    const fetchedTeams = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((team) =>
        team.teamName?.toLowerCase()?.includes(searchQuery.toLowerCase())
      )

    return fetchedTeams
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
      getUserInfo(currentUser.uid).then(
        (info) => setUserInfos(info),
        setUserInfoLoading(false)
      )
    }
  }, [currentUser])

  return {
    currentUser,
    loading,
    userInfos,
    userInfoLoading,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    getLeagues,
    createLeague,
    createTeam,
    getMemberTeamNameFromReference,
    updateUserToCaptain,
    getTeamsByLeagueId,
    joinTeam,
    getTeamData,
    getMembersData,
    getUserInfoByReference,
  }
}
