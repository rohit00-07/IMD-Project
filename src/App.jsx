import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import Prediction from "./Prediction"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Prediction" element={<Prediction />} />
    </Routes>
  )
}

export default App

