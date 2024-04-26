import { useEffect, useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import Spinner from "./Spinner"
import { AiFillEdit, AiOutlineClose, AiFillFlag } from "react-icons/ai"
import ReactModal from "react-modal"
import Alert from "./Alert"
import
{ Space, TimePicker }
from
"antd"
;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

export default function MatchList({
  matches,
  divClassName = "",
  listClassName = "",
  itemsClassName = "",
  page = 1,
  pageSize = 10,
  currentTeamName,
  actionButtons = false,
  leagueId,
}) {
  const { updateMatchScore, getTeamSchedule } = useAuth()
  const [loading, setLoading] = useState(true)
  const [highlightTeam, setHighlightTeam] = useState(null)
  const [scoreModalIsOpen, setScoreModaIsOpen] = useState(false)
  const [walkoverModalIsOpen, setWalkoverModalIsOpen] = useState(false)
  const [dateChangeModalIsOpen, setDateChangeModalIsOpen] = useState(false)
  const [error, setError] = useState("")
  const [editedMatch, setEditedMatch] = useState("")
  const homeScoreRef = useRef()
  const awayScoreRef = useRef()
  const dateRef = useRef()
  const timeRef = useRef()
  const [message, setMessage] = useState("")
  const [teamSchedule, setTeamSchedule] = useState([])
  const [paginatedData, setPaginatedData] = useState([])
  const [matchEdited, setMatchEdited] = useState(0)
  const [changeState, setChangeState] = useState({})

  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize


  dayjs.extend(customParseFormat)

  const openModal = (e, modalType) => {
    setEditedMatch(e)

    switch(modalType) {
      case "dateChange":
        setDateChangeModalIsOpen(true)
        break
      case "walkover":
        setWalkoverModalIsOpen(true)
        break
      case "score":
        setScoreModaIsOpen(true)
        break
      default:
        setScoreModaIsOpen(true)
        break
    }
  }

  const closeModal = () => {
    setScoreModaIsOpen(false)
    setDateChangeModalIsOpen(false)
    setWalkoverModalIsOpen(false)
    setEditedMatch("")
    setError("")
    setMessage("")
  }

  useEffect(() => {
    setLoading(true)
    if (matches) {
      setTeamSchedule(matches)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)

    if (teamSchedule) {
      setLoading(false)
    }
  }, [teamSchedule])

  useEffect(() => {
    setLoading(true)
    if (teamSchedule) {
      console.log("Matches", teamSchedule)
      const teamName = currentTeamName
      setHighlightTeam(teamName)
      setLoading(false)
    }
  }, [teamSchedule, currentTeamName])

  useEffect(() => {
    console.log("TeamSchedule1", teamSchedule)
    if (teamSchedule && teamSchedule.length > 0) {
      console.log("warunek1: ", teamSchedule[0].hometeamName, currentTeamName)
      if (teamSchedule[0].hometeamName === currentTeamName) {
        const hometeamRef = teamSchedule[0].homeTeam
        getTeamSchedule(hometeamRef, true)
          .then((data) => {
            setTeamSchedule(data)
            console.log("TeamSchedule2", teamSchedule)
            setPaginatedData(teamSchedule.slice(startIndex, endIndex))
            console.log("PaginatedData1", paginatedData)
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        const awayTeamRef = teamSchedule[0].awayTeam
        getTeamSchedule(awayTeamRef, true)
          .then((data) => {
            setTeamSchedule(data)
            console.log("TeamSchedule3", teamSchedule)
            setPaginatedData(teamSchedule.slice(startIndex, endIndex))
            console.log("PaginatedData2", paginatedData)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }, [matchEdited, pageSize])

  useEffect(() => {
    if (teamSchedule) {
      setPaginatedData(teamSchedule.slice(startIndex, endIndex))
    }
  }, [page, pageSize, teamSchedule])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    const homeScore = homeScoreRef.current.value
    const awayScore = awayScoreRef.current.value

    if (homeScore === "" || awayScore === "") {
      setError("Wprowadź wynik meczu")
      return
    }

    if (isNaN(homeScore) || isNaN(awayScore)) {
      setError("Wprowadź poprawne wyniki meczu")
      return
    }

    if (homeScore < 0 || awayScore < 0) {
      setError("Wprowadź poprawne wyniki meczu")
      return
    }

    const match = {
      homeScore: parseInt(homeScore),
      awayScore: parseInt(awayScore),
    }
    console.log(leagueId, editedMatch.id, match.homeScore, match.awayScore)

    if (leagueId) {
      updateMatchScore(
        editedMatch.id,
        leagueId,
        match.homeScore,
        match.awayScore
      )
        .then(() => {
          setMessage("Wynik meczu został zapisany")

          setMatchEdited(matchEdited + 1)
          setTimeout(() => {
            closeModal()
          }, 2000)
        })
        .catch((error) => {
          console.log(error)
          setError("Wystąpił błąd podczas zapisywania wyniku meczu")
        })
    }
  }

  const declareWalkover = (e) => {
    e.preventDefault()
    setEditedMatch(e)
    setError("")
    setMessage("")

    //check which team is giving walkover
    if (currentTeamName === editedMatch.homeTeamName) {
      const match = {
        homeScore: 0,
        awayScore: 3,
      }
      console.log(leagueId, editedMatch.id, match.homeScore, match.awayScore)

      if (leagueId) {
        updateMatchScore(
          editedMatch.id,
          leagueId,
          match.homeScore,
          match.awayScore,
          "walkover"
        )
          .then(() => {
            setMessage("Wynik meczu został zapisany")

            setMatchEdited(matchEdited + 1)
            setTimeout(() => {
              closeModal()
            }, 2000)
          })
          .catch((error) => {
            console.log(error)
            setError("Wystąpił błąd podczas zapisywania wyniku meczu")
          })
      }
    } else {
      const match = {
        homeScore: 3,
        awayScore: 0,
      }

      if (leagueId) {
        updateMatchScore(
          editedMatch.id,
          leagueId,
          match.homeScore,
          match.awayScore,
          "walkover"
        )
          .then(() => {
            setMessage("Wynik meczu został zapisany")

            setMatchEdited(matchEdited + 1)
            setTimeout(() => {
              closeModal()
            }, 2000)
          })
          .catch((error) => {
            console.log(error)
            setError("Wystąpił błąd podczas zapisywania wyniku meczu")
          })
      }
    }
  }

  const handleChangeState = (e) => {  
    setChangeState({
      ...changeState,
      [e.target.name]: e.target.value
    })
  }

  if (loading) {
    return <Spinner positioning=" flex justify-center" />
  }  

  if(editedMatch) {  
  console.log("Formatted splitted date", editedMatch.timestampDate.toISOString().split("T")[1])
  console.log("Dayjs date", dayjs(editedMatch.timestampDate.toISOString().split("T")[1], "HH:mm:ss.SSS"))
  }
  return (
    <div className={divClassName}>
      {editedMatch !== "" && (
        <>
          <ReactModal
            isOpen={scoreModalIsOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={closeModal}
            className=" bg-secondary rounded-lg p-4 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 w-3/5 md:w-[400px]  h-auto z-50"
          >
            <div className="flex justify-end">
              <button className="block" onClick={closeModal}>
                <AiOutlineClose size={20} />
              </button>
            </div>
            <div>
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-white text-xl md:text-2xl font-bold">
                  Ustal wynik meczu
                </h2>

                {error && <Alert message={error} type="error" />}
                {message && <Alert message={message} type="success" />}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-row items-center justify-evenly my-3">
                  <label
                    htmlFor="homeScore"
                    className={
                      highlightTeam === editedMatch.homeTeamName
                        ? "text-yellow-300 text-base font-bold md:text-2xl"
                        : "text-white text-base font-bold md:text-2xl"
                    }
                  >
                    {editedMatch.homeTeamName}
                  </label>
                  <input
                    type="text"
                    name="homeScore"
                    id="homeScore"
                    maxLength={2}
                    className="bg-secondary text-center text-white text-base md:text-xl w-[35px] px-1 rounded "
                    ref={homeScoreRef}
                  />
                  <span> : </span>
                  <input
                    type="text"
                    name="awayScore"
                    id="awayScore"
                    maxLength={2}
                    size={2}
                    className="bg-secondary text-center text-white text-base md:text-xl w-[35px] rounded px-1"
                    ref={awayScoreRef}
                  />
                  <label
                    htmlFor="awayScore"
                    className={
                      highlightTeam === editedMatch.awayTeamName
                        ? "text-yellow-300 text-base font-bold md:text-2xl"
                        : "text-white text-base font-bold md:text-2xl"
                    }
                  >
                    {editedMatch.awayTeamName}
                  </label>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <button
                    className="bg-fourth hover:bg-third text-white text-sm md:text-base mt-3 py-1 px-5 rounded"
                    onClick={handleSubmit}
                  >
                    Zapisz wynik
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white text-sm md:text-base ml-4 mt-3 py-1 px-5 rounded"
                    onClick={closeModal}
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            </div>
          </ReactModal>
        </>
      )}
      {editedMatch !== "" && (
        <>
          <ReactModal
            isOpen={walkoverModalIsOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={closeModal}
            className=" bg-secondary rounded-lg p-4 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 w-3/5 md:w-[400px]  h-auto z-50"
          >
            <div className="flex justify-end">
              <button className="block" onClick={closeModal}>
                <AiOutlineClose size={20} />
              </button>
            </div>
            <div>
              <div className="flex flex-col justify-center items-center">
                {error && <Alert message={error} type="error" />}
                {message && <Alert message={message} type="success" />}
              </div>

              <div className="flex flex-row justify-center items-center">
                <span className="text-white text-xl md:text-base text-center">
                  Czy chcesz oddać mecz walkowerem?
                </span>
              </div>
              <div className="flex flex-row justify-center items-center">
                <button
                  className="bg-fourth hover:bg-third text-white text-sm md:text-base mt-3 py-1 px-5 rounded"
                  onClick={declareWalkover}
                >
                  Tak
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white text-sm md:text-base ml-4 mt-3 py-1 px-5 rounded"
                  onClick={closeModal}
                >
                  Nie
                </button>
              </div>
            </div>
          </ReactModal>
        </>
      )}
      {editedMatch !== "" && (
        <>
          <ReactModal
            isOpen={dateChangeModalIsOpen}
            shouldCloseOnOverlayClick={true}
            onRequestClose={closeModal}
            className=" bg-secondary rounded-lg p-4 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 w-3/5 md:w-[400px]  h-auto z-50"
          >
            <div className="flex justify-end">
              <button className="block" onClick={closeModal}>
                <AiOutlineClose size={20} />
              </button>
            </div>
            <div>
              <div className="flex flex-col justify-center items-center">
                {error && <Alert message={error} type="error" />}
                {message && <Alert message={message} type="success" />}
              </div>

              <div className="flex flex-row justify-center items-center">
                <span className="text-white text-xl md:text-2xl text-center font-bold mb-4">
                  Zmień datę meczu
                </span>
              </div>
              <div>
                <form>
                  <div className="flex flex-col md:flex-row justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                    <label
                      htmlFor="matchDate"
                      className="text-white text-base"
                    >
                      Data:
                    </label>
                    <input
                      type="date"
                      name="matchDate"
                      id="matchDate"
                      ref={dateRef}
                      min={new Date().toISOString().split("T")[0]}
                      defaultValue={dayjs(editedMatch.timestampDate.toISOString().split("T")[1], "HH:mm:ss.SSS")}
                      onChange={handleChangeState}
                      className="bg-secondary text-white text-base text-center  w-[130px] px-1 rounded ml-2 focus:border-fourth"
                    />
                    </div>
                    <div className="flex flex-col justify-center ml-2 mt-2 md:mt-0 items-center">
                     <label
                      htmlFor="matchTime"
                      className="text-white text-base"
                    >
                      Godzina:
                    </label>
                    {/*
                    <input
                      type="time"
                      name="matchTime"
                      id="matchTime"
                      ref={timeRef}
                      defaultValue={editedMatch.timestampHour}
                      onChange={handleChangeState}
                      step={900}
                      className="bg-secondary text-white text-base  text-center w-[100px] px-1 rounded ml-2"
                    /> */}
                      <Space wrap>

    <TimePicker id="matchTime" defaultValue={dayjs(editedMatch.timestampHour)}
     size="large"  
     minuteStep={15} 
     className="bg-secondary focus:bg-secondary text-white focus:text-white" 
     format="HH:mm"
     needConfirm={false}
  
     />

      </Space>
              </div>  
                    </div>
                    </form>
              </div>
              <div className="flex flex-row justify-center items-center">
                <button
                  className="bg-fourth hover:bg-third text-white text-sm md:text-base mt-3 py-1 px-4 rounded"
                  onClick={declareWalkover}
                >
                  Ustaw
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white text-sm md:text-base ml-4 mt-3 py-1 px-4 rounded"
                  onClick={closeModal}
                >
                  Anuluj
                </button>
              </div>
            </div>
          </ReactModal>
        </>
      )}
      {paginatedData && (
        <div className={listClassName}>
          {paginatedData.map((match, index) => (
            <div key={index} className="flex flex-row items-center justify-end">
              <div className={itemsClassName}>
                <div className="flex flex-row items-center justify-start">
                  <div className="text-start w-1/3 text-sm">
                    <span>{match.roundNo}</span>
                    <span>. kolejka</span>
                  </div>
                  <div className="flex justify-center items-center text-center w-1/3 text-sm pl-2">
                    <span>{match.timestampDay} {match.timestampHour}</span>
                    <button
                    className="ml-1 mb-[0.15rem]"
                      onClick={(e) => openModal(match, "dateChange")}
                    >
                      <AiFillEdit />
                    </button>
                  </div>
                  <div className="text-end w-1/3 text-sm">
                    <span>
                      {" "}
                      {match.status === "upcoming"
                        ? "Mecz nadchodzący"
                        : match.status === "finished"
                          ? "Mecz zakończony"
                          : match.status === "walkover"
                            ? "Mecz poddany"
                              : ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row  items-center justify-between text-xl font-bold">
                  <span
                    className={
                      highlightTeam === match.homeTeamName
                        ? "text-yellow-300 font-bold text-start w-1/3"
                        : "font-bold w-1/3"
                    }
                  >
                    {match.homeTeamName}
                  </span>
                  <div className="w-1/3 text-center">
                    <span className="font-bold text-2xl">
                      {match.result.homeScore !== null
                        ? match.result.homeScore
                        : "-"}
                    </span>
                    <span> : </span>
                    <span className="font-bold text-2xl">
                      {match.result.awayScore !== null
                        ? match.result.awayScore
                        : "-"}
                    </span>
                  </div>
                  <span
                    className={
                      highlightTeam === match.awayTeamName
                        ? "text-yellow-300 font-bold text-end w-1/3"
                        : " font-bold text-end w-1/3"
                    }
                  >
                    {match.awayTeamName}
                  </span>
                </div>
              </div>
              <div className="w-1/12 flex flex-col items-center justify-between">
                {actionButtons &&
                match.status !== "finished" &&
                match.status !== "walkover" ? (
                  <div className="flex flex-col md:flex-row justify-center items-center">
                    <button
                      className="bg-fourth hover:bg-third px-1 py-1 ml-1 rounded-md"
                      onClick={(e) => openModal(match, "score")}
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 mt-1 md:mt-0 px-1 py-1 ml-1 rounded-md"
                      onClick={(e) => openModal(match, "walkover")}
                    >
                      <AiFillFlag />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
