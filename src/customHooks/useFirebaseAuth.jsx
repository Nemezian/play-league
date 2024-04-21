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
  deleteDoc,
} from "firebase/firestore"

export function useFirebaseAuth() {
  const [currentUser, setCurrentUser] = useState()
  const [userInfos, setUserInfos] = useState()
  const [loading, setLoading] = useState(true)
  const [userInfoLoading, setUserInfoLoading] = useState(true)
  const [scheduleLoading, setScheduleLoading] = useState(true)
  const [scheduleInfo, setScheduleInfo] = useState()

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
        const memberDataWithId = { ...docData, id: member.id }
        membersData.push(memberDataWithId)
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
    if (teamDocRef) {
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

  const updateUserRolesAfterTeamDelete = async (teamRefId) => {
    const userColRef = collection(firestore, "users")
    const querySnapshot = await getDocs(userColRef)

    if (querySnapshot.empty) {
      console.log("No users found in the database!")
      return
    }

    console.log("Users found in the database!")
    console.log("QuerySnapshot docs: ", querySnapshot.docs)
    for (const document of querySnapshot.docs) {
      const docData = document.data()
      const docRefPath = docData.teamId.path
      const teamIdRefPath = teamRefId.path

      if (docRefPath === teamIdRefPath) {
        console.log("User found in the team!")
        const userRef = doc(firestore, "users", document.id)
        const userData = {
          role: "player",
          teamId: null,
          updatedAt: new Date(),
        }
        try {
          await setDoc(userRef, userData, { merge: true })
          console.log("User roles successfully updated!")
        } catch (error) {
          console.error("Error while updating user roles: ", error)
        }
      }
    }
  }

  const createTeam = async (
    teamName,
    teamDescription,
    leagueId,
    joinPassword,
    preferredMatchDays
  ) => {
    const teamColRef = collection(firestore, "leagues", leagueId, "teams")

    const docData = {
      teamName,
      teamDescription,
      joinPassword: joinPassword,
      captain: doc(firestore, "users", currentUser.uid),
      players: [],
      preferredMatchDays: preferredMatchDays,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await addDoc(teamColRef, docData)
      .then((result) => {
        updateUserToCaptain(result.id, leagueId)
        getUserInfo(currentUser.uid).then(
          (info) => setUserInfos(info),
          setUserInfoLoading(false)
        )

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

  const getTeamDataByReference = async (teamRef) => {
    const mySnapshot = await getDoc(teamRef)
    if (mySnapshot.exists()) {
      const docData = mySnapshot.data()
      console.log("Document data: ", docData)
      return docData
    } else {
      console.log("No such document!")
      return null
    }
  }

  const getTeamSchedule = async (teamRef) => {
    const leagueId = teamRef.path.split("/")[1]
    const scheduleColRef = collection(
      firestore,
      "leagues",
      leagueId,
      "schedule"
    )
    const querySnapshot = await getDocs(scheduleColRef)
    const fetchedMatches = []

    if (querySnapshot.empty) {
      console.log("No schedules found in the database!")
      return
    }

    for (const document of querySnapshot.docs) {
      const docData = document.data()
      if (
        docData.homeTeam.path === teamRef.path ||
        docData.awayTeam.path === teamRef.path
      ) {
        fetchedMatches.push(docData)
      }
    }
    return fetchedMatches
  }

  const deleteTeam = async (teamRef) => {
    await deleteDoc(teamRef)
      .then(() => {
        updateUserRolesAfterTeamDelete(teamRef)
        setUserInfoLoading(true)
        console.log("Document successfully deleted!")
      })
      .catch((error) => {
        console.error("Error removing document: ", error)
      })
  }

  const updateTeamInfo = async (teamRef, teamData) => {
    await setDoc(teamRef, teamData, { merge: true })
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  const kickTeamMember = async (playerId) => {
    const memberRef = doc(firestore, "users", playerId)
    const mySnapshot = await getDoc(memberRef)
    if (mySnapshot.exists()) {
      const userDocData = mySnapshot.data()
      if (
        userDocData.role === "captain" ||
        userDocData.role === "player" ||
        userDocData.teamId === null
      ) {
        console.log("Cannot kick this user from the team")
        return
      }
      const teamRef = userDocData.teamId
      const teamSnapshot = await getDoc(teamRef)
      if (teamSnapshot.exists()) {
        const teamDocData = teamSnapshot.data()
        const teamData = {
          players: teamDocData.players.filter(
            (player) => player.path !== memberRef.path
          ),
          updatedAt: new Date(),
        }
        await setDoc(teamRef, teamData, { merge: true })
          .then(() => {
            console.log("Team document successfully updated!")
          })
          .catch((error) => {
            console.error("Error while setting team document: ", error)
          })

        const userData = {
          role: "player",
          teamId: null,
          updatedAt: new Date(),
        }
        await setDoc(memberRef, userData, { merge: true })
          .then(() => {
            console.log("User document successfully updated!")
            setUserInfoLoading(true)
            getUserInfo(currentUser.uid).then(
              (info) => setUserInfos(info),
              setUserInfoLoading(false)
            )
          })
          .catch((error) => {
            console.error("Error while setting user document: ", error)
          })
      }
    } else {
      console.log("No such document!")
      return null
    }
  }

  const leaveTeam = async (teamRef) => {
    const userRef = doc(firestore, "users", currentUser.uid)
    const mySnapshot = await getDoc(userRef)
    if (mySnapshot.exists()) {
      const userDocData = {
        role: "player",
        teamId: null,
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
    }

    const myTeamSnapshot = await getDoc(teamRef)
    if (myTeamSnapshot.exists()) {
      const docData = myTeamSnapshot.data()
      const teamDocData = {
        players: docData.players.filter(
          (player) => player.path !== userRef.path
        ),
        updatedAt: new Date(),
      }
      await setDoc(teamRef, teamDocData, { merge: true })
        .then(() => {
          console.log("Document successfully written!")
        })
        .catch((error) => {
          console.error("Error adding document: ", error)
        })
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
    if (currentUser && currentUser.uid && loading === false) {
      getUserInfo(currentUser.uid).then(
        (info) => setUserInfos(info),
        setUserInfoLoading(false),
        console.log("User info fetched", userInfos)
      )
    }
  }, [currentUser, userInfoLoading])

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
    deleteTeam,
    getTeamSchedule,
    kickTeamMember,
    updateTeamInfo,
    getTeamData,
    getMembersData,
    getUserInfoByReference,
    getTeamDataByReference,
    leaveTeam,
  }
}
