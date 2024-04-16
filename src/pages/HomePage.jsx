import { useLocation } from "react-router-dom"
import { Alert } from "../components"

export default function HomePage() {
  const location = useLocation()
  const message = location.state?.message

  return (
    <>
      <div className="flex-col text-center h-[100%] justify-end">
        <h1 className="my-6 text-4xl">Strona główna</h1>
        {message && <Alert message={message} type="success" />}
        <p className="max-w-[70%] mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
          volutpat neque elit, a eleifend leo fermentum a. Orci varius natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Nunc vehicula nisl sit amet efficitur dignissim. Ut venenatis egestas
          dolor, non aliquam enim hendrerit a. Aliquam luctus quis ante eu
          posuere. Curabitur a gravida risus, ac molestie elit. Fusce faucibus
          sapien dolor. Aenean nec suscipit nibh. Etiam mollis, sem eu malesuada
          fringilla, leo elit finibus dui, quis volutpat diam ligula vel elit.
          Mauris non arcu eget sem interdum dignissim. Vivamus vel odio et lorem
          dignissim tempus vel in orci. Vestibulum ante ipsum primis in faucibus
          orci luctus et ultrices posuere cubilia curae; Duis cursus lacus at
          arcu fermentum cursus. Ut varius a nulla sed elementum. Nunc eu
          malesuada mi. Quisque a ex ac augue pulvinar ultrices.
        </p>
      </div>
    </>
  )
}
