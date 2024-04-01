import { useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import FormAction from "./FormAction"
import Alert from "./Alert"
import Input from "./Input"

export default function TeamCreation() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Stwórz drużynę</h1>
      <form className="mt-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="team-name" className="text-white">
            Nazwa drużyny
          </label>
          <input
            type="text"
            id="team-name"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <label htmlFor="team-description" className="text-white">
            Opis drużyny
          </label>
          <textarea
            id="team-description"
            className="p-2 bg-gray-500/[.8] rounded-lg"
          />
        </div>

        <FormAction text="Stwórz drużynę" />
      </form>
    </div>
  )
}
