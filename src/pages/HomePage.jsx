import { Footer, Nav } from "../components"
import { Flowbite } from "flowbite-react"

export default function HomePage() {
  return (
    <>
      <Flowbite>
        <Nav />
        <h1>Strona główna</h1>
        <Footer />
      </Flowbite>
    </>
  )
}
