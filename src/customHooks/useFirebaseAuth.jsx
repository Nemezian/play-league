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
      if (docData.teamId === null) {
        continue
      }
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
    setUserInfoLoading(true)
    await addDoc(teamColRef, docData)
      .then((result) => {
        updateUserToCaptain(result.id, leagueId)
        getUserInfo(currentUser.uid).then(
          (info) => setUserInfos(info),
          setUserInfoLoading(false)
        )
        createDefaultStandingsRecord(result.id, leagueId)

        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  const countLeagueTeams = async (leagueId) => {
    const teamColRef = collection(firestore, "leagues", leagueId, "teams")
    const querySnapshot = await getDocs(teamColRef)
    return querySnapshot.size
  }

  const createDefaultStandingsRecord = async (teamId, leagueId) => {
    const standingsDocRef = doc(
      firestore,
      "leagues",
      leagueId,
      "standings",
      teamId
    )
    const docData = {
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      matchesPlayed: 0,
      lastFive: [null, null, null, null, null],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await setDoc(standingsDocRef, docData)
      .then(() => {
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

  const getLeagueStandings = async (leagueId) => {
    if (!leagueId) {
      console.error("League ID is not provided!")
      return
    }

    const teamColRef = collection(firestore, "leagues", leagueId, "teams")
    const teamQuerySnapshot = await getDocs(teamColRef)
    const fetchedTeams = teamQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      teamName: doc.data().teamName,
    }))
    const fetchedStandings = []

    if (teamQuerySnapshot.empty) {
      console.log("No teams found in the database!")
      return
    }

    for (const team of fetchedTeams) {
      const teamId = team.id
      const standingsDocRef = doc(
        firestore,
        "leagues",
        leagueId,
        "standings",
        teamId
      )
      const mySnapshot = await getDoc(standingsDocRef)
      if (mySnapshot.exists()) {
        const docData = mySnapshot.data()
        const teamStandingsData = {
          ...team,
          ...docData,
        }
        fetchedStandings.push(teamStandingsData)
      }
    }

    return fetchedStandings
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

  const getTeamSchedule = async (teamRef, sortByRound = false) => {
    const leagueId = teamRef.path.split("/")[1]
    const scheduleColRef = collection(
      firestore,
      "leagues",
      leagueId,
      "schedule"
    )
    setScheduleLoading(true)
    const querySnapshot = await getDocs(scheduleColRef)
    const fetchedMatches = []

    if (querySnapshot.empty) {
      setScheduleLoading(false)
      console.log("No schedules found in the database!")
      return
    }

    for (const document of querySnapshot.docs) {
      const docData = document.data()
      if (
        docData.homeTeam.path === teamRef.path ||
        docData.awayTeam.path === teamRef.path
      ) {
        await getTeamDataByReference(docData.homeTeam)
          .then((homeTeamData) => {
            const homeTeamName = homeTeamData.teamName
            const matchData = {
              id: document.id,
              ...docData,
              homeTeamName: homeTeamName,
              timestampDay: docData.dateTime.toDate().toLocaleDateString(),
              timestampHour: docData.dateTime
                .toDate()
                .toLocaleTimeString("en-GB", { timeZone: "Europe/Warsaw" }),
              timestampTest: docData.dateTime.toDate(),
            }
            fetchedMatches.push(matchData)
          })
          .catch((error) => {
            console.error(
              "An error occurred while fetching home team data",
              error
            )
          })
      }
    }

    if (sortByRound && fetchedMatches.length > 0) {
      const sortedMatches = fetchedMatches.sort((a, b) => a.roundNo - b.roundNo)
      setScheduleLoading(false)
      return sortedMatches
    }
    setScheduleLoading(false)
    return fetchedMatches
  }

  const deleteTeam = async (teamRef) => {
    setUserInfoLoading(true)
    await deleteDoc(teamRef)
      .then(() => {
        console.log("Document successfully deleted!")
      })
      .catch((error) => {
        console.error("Error removing document: ", error)
        setUserInfoLoading(false)
        return
      })
    await updateUserRolesAfterTeamDelete(teamRef)

    await deleteTeamStandingsRecord(teamRef)
    await getUserInfo(currentUser.uid).then(
      (info) => setUserInfos(info),
      setUserInfoLoading(false)
    )
  }

  const updateTeamStandings = async (matchRef, homeScore, awayScore) => {
    const leagueId = matchRef.path.split("/")[1]
    const matchData = await getDoc(matchRef)
    const matchDocData = matchData.data()
    const homeTeamRef = matchDocData.homeTeam
    const awayTeamRef = matchDocData.awayTeam
    const homeTeamData = await getTeamDataByReference(homeTeamRef)
    const awayTeamData = await getTeamDataByReference(awayTeamRef)
    const homeTeamStandingsRef = doc(
      firestore,
      "leagues",
      leagueId,
      "standings",
      homeTeamRef.id
    )
    const awayTeamStandingsRef = doc(
      firestore,
      "leagues",
      leagueId,
      "standings",
      awayTeamRef.id
    )

    const homeTeamStandingsData = await getDoc(homeTeamStandingsRef)
    const awayTeamStandingsData = await getDoc(awayTeamStandingsRef)

    const homeTeamStandingsDocData = homeTeamStandingsData.data()
    const awayTeamStandingsDocData = awayTeamStandingsData.data()

    const homeTeamMatchData = {
      points: homeTeamStandingsDocData.points,
      wins: homeTeamStandingsDocData.wins,
      draws: homeTeamStandingsDocData.draws,
      losses: homeTeamStandingsDocData.losses,
      matchesPlayed: homeTeamStandingsDocData.matchesPlayed,
      lastFive: homeTeamStandingsDocData.lastFive,
    }

    const awayTeamMatchData = {
      points: awayTeamStandingsDocData.points,
      wins: awayTeamStandingsDocData.wins,
      draws: awayTeamStandingsDocData.draws,
      losses: awayTeamStandingsDocData.losses,
      matchesPlayed: awayTeamStandingsDocData.matchesPlayed,
      lastFive: awayTeamStandingsDocData.lastFive,
    }

    homeTeamMatchData.matchesPlayed++
    awayTeamMatchData.matchesPlayed++

    if (homeScore > awayScore) {
      homeTeamMatchData.points += 3
      homeTeamMatchData.wins++
      awayTeamMatchData.losses++
    } else if (homeScore < awayScore) {
      awayTeamMatchData.points += 3
      awayTeamMatchData.wins++
      homeTeamMatchData.losses++
    } else {
      homeTeamMatchData.points++
      awayTeamMatchData.points++
      homeTeamMatchData.draws++
      awayTeamMatchData.draws++
    }

    //assign at first index, if its taken, shift all elements to the right and then add new element {"win", "draw", "loss"}
    homeTeamMatchData.lastFive.unshift(
      homeScore > awayScore ? "win" : homeScore === awayScore ? "draw" : "loss"
    )
    if (homeTeamMatchData.lastFive.length > 5) {
      homeTeamMatchData.lastFive.pop()
    }
    awayTeamMatchData.lastFive.unshift(
      homeScore < awayScore ? "win" : homeScore === awayScore ? "draw" : "loss"
    )
    if (awayTeamMatchData.lastFive.length > 5) {
      awayTeamMatchData.lastFive.pop()
    }

    await setDoc(homeTeamStandingsRef, homeTeamMatchData, { merge: true })
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })

    await setDoc(awayTeamStandingsRef, awayTeamMatchData, { merge: true })
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })
  }

  const updateMatchScore = async (
    matchId,
    leagueId,
    homeScore,
    awayScore,
    status = "finished"
  ) => {
    const matchRef = doc(firestore, "leagues", leagueId, "schedule", matchId)
    const matchData = {
      result: {
        homeScore: homeScore,
        awayScore: awayScore,
      },
      status: status,
    }
    await setDoc(matchRef, matchData, { merge: true })
      .then(() => {
        console.log("Document successfully written!")
      })
      .catch((error) => {
        console.error("Error adding document: ", error)
      })

    await updateTeamStandings(matchRef, homeScore, awayScore)
  }

  const deleteTeamStandingsRecord = async (teamRef) => {
    const leagueId = teamRef.path.split("/")[1]
    const teamId = teamRef.path.split("/")[3]
    const standingsDocRef = doc(
      firestore,
      "leagues",
      leagueId,
      "standings",
      teamId
    )
    await deleteDoc(standingsDocRef)
      .then(() => {
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

  const deleteAllMatchesButFirst = async (leagueId) => {
    const scheduleColRef = collection(
      firestore,
      "leagues",
      leagueId,
      "schedule"
    )
    const querySnapshot = await getDocs(scheduleColRef)

    if (querySnapshot.empty) {
      console.log("No schedules found in the database!")
      return
    }

    const firstMatch = querySnapshot.docs[0]
    const firstMatchId = firstMatch.id

    for (const document of querySnapshot.docs) {
      if (document.id !== firstMatchId) {
        await deleteDoc(document.ref)
          .then(() => {
            console.log("Document successfully deleted!")
          })
          .catch((error) => {
            console.error("Error removing document: ", error)
          })
      }
    }
  }

  // Function to generate a match schedule for teams in a league
  const generateMatchSchedule = async (leagueId) => {
    const leagueRef = doc(firestore, "leagues", leagueId)
    const teamsDocs = await getTeamsByLeagueId(leagueId)
    const teams = teamsDocs.map((team) => team.teamName)
    const matchSchedule = []
    const reversedMatchSchedule = []
    const weekdays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ]
    const numTeams = teamsDocs.length
    const numRounds = teamsDocs.length - 1

    for (let round = 0; round < numRounds; round++) {
      const roundMatches = []
      const roundMatchesReversed = []

      for (let i = 0; i < numTeams / 2; i++) {
        const homeTeam = teamsDocs[i]
        const awayTeam = teamsDocs[numTeams - 1 - i]
        const homeTeamRef = doc(
          firestore,
          "leagues",
          leagueId,
          "teams",
          homeTeam.id
        )
        const awayTeamRef = doc(
          firestore,
          "leagues",
          leagueId,
          "teams",
          awayTeam.id
        )
        const homeTeamName = homeTeam.teamName
        const awayTeamName = awayTeam.teamName

        const matchDate = await getNextMatchDate(
          homeTeam,
          awayTeam,
          weekdays,
          round
        )

        const matchDateReversed = await getNextMatchDate(
          awayTeam,
          homeTeam,
          weekdays,
          round + numRounds
        )

        // Create a match object with home team, away team, and match date
        const match = {
          roundNo: round + 1,
          homeTeam: homeTeamRef,
          awayTeam: awayTeamRef,
          homeTeamName: homeTeamName,
          awayTeamName: awayTeamName,
          dateTime: matchDate,
          createdAt: new Date(),
          updatedAt: new Date(),
          result: { homeScore: null, awayScore: null },
          status: "upcoming",
        }
        console.log("Match: ", match)
        const matchReversed = {
          roundNo: round + numRounds + 1,
          homeTeam: awayTeamRef,
          awayTeam: homeTeamRef,
          homeTeamName: awayTeamName,
          awayTeamName: homeTeamName,
          dateTime: matchDateReversed,
          createdAt: new Date(),
          updatedAt: new Date(),
          result: { homeScore: null, awayScore: null },
          status: "upcoming",
        }
        console.log("Match reversed: ", matchReversed)

        roundMatches.push(match)
        roundMatchesReversed.push(matchReversed)

        // console.log("added match ", match, " to round ", round, " matches")
        await addDoc(
          collection(firestore, "leagues", leagueId, "schedule"),
          match
        )
          .then(() => {
            console.log("Document successfully written! schedule1")
          })
          .catch((error) => {
            console.error("Error adding document schedule1: ", error)
          })
        await addDoc(
          collection(firestore, "leagues", leagueId, "schedule"),
          matchReversed
        )
          .then(() => {
            console.log("Document successfully written! schedule2")
          })
          .catch((error) => {
            console.error("Error adding document schedule2: ", error)
          })
      }

      teamsDocs.splice(1, 0, teamsDocs.pop())
      matchSchedule.push(roundMatches)
      reversedMatchSchedule.push(roundMatchesReversed)
    }
  }

  const getNextMatchDate = async (
    homeTeam,
    awayTeam,
    weekdays,
    currentRound
  ) => {
    let preferredMatchDays = homeTeam.preferredMatchDays.concat(
      awayTeam.preferredMatchDays
    )

    if (preferredMatchDays.length === 0) {
      preferredMatchDays = weekdays
    }

    // Count the number of weekdays in the preferred match days and sort them by index
    const weekdayCounts = {}
    for (const weekday of preferredMatchDays) {
      const weekdayIndex = weekdays.indexOf(weekday)
      if (weekdayCounts[weekdayIndex]) {
        weekdayCounts[weekdayIndex]++
      } else {
        weekdayCounts[weekdayIndex] = 1
      }
    }

    // Sort the weekdays by count in descending order
    preferredMatchDays.sort((a, b) => {
      const countA = weekdayCounts[weekdays.indexOf(a)]
      const countB = weekdayCounts[weekdays.indexOf(b)]
      return countB - countA
    })

    // Calculate the number of weeks to add based on the current round number
    const weeksToAdd = currentRound

    // Find the first available weekday for the match  in the next week
    let nextMatchDate
    for (const weekday of preferredMatchDays) {
      const weekdayIndex = weekdays.indexOf(weekday)
      nextMatchDate = await getNextWeekday(weekdayIndex, weeksToAdd)
      break
    }

    console.log("Next match date: ", nextMatchDate)
    return nextMatchDate
  }

  const getNextWeekday = async (weekdayIndex, weeksToAdd) => {
    console.log("Weekday index: ", weekdayIndex)
    console.log("Weeks to add: ", weeksToAdd)
    const today = new Date()
    const currentDay = (today.getDay() + 6) % 7 // Adjust current day index to start from Monday (0 for Monday, 1 for Tuesday, ..., 6 for Sunday)
    console.log("Current day: ", currentDay)

    let daysToAdd = weekdayIndex + 7 - currentDay // Calculate the number of days to add to reach the desired weekday
    console.log("Days to add: ", daysToAdd)

    // Adjust days to add based on the number of weeks to add
    daysToAdd += weeksToAdd * 7

    const nextWeekday = new Date(today)
    nextWeekday.setDate(today.getDate() + daysToAdd) // Set the date to the next weekday
    nextWeekday.setHours(18, 0, 0, 0)

    console.log("Next weekday: ", nextWeekday)
    return nextWeekday
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
        setUserInfoLoading(false)
      )
    }
  }, [currentUser, userInfoLoading])

  return {
    currentUser,
    loading,
    userInfos,
    userInfoLoading,
    scheduleLoading,
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
    getLeagueStandings,
    countLeagueTeams,
    generateMatchSchedule,
    deleteAllMatchesButFirst,
    updateMatchScore,
  }
}
