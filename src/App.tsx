import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Pages from './pages'
import Helpers from "./helpers"
import './App.css'

function App() {

  return (
      <Router>
        <Routes>
          <Route path='/' index={true} element={<Pages.Signup />}/>
          <Route path='/login' element={<Pages.SignIn />}/>
          <Route element={<Helpers.ProtectedRoute />}>
            <Route path='/dashboard' element={<Pages.Dashboard />}/>
          </Route>
        </Routes>
      </Router>
  )
}

export default App
