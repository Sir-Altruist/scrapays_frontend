import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Pages from './pages'
import './App.css'

function App() {

  return (
      <Router>
        <Routes>
          <Route path='/' index={true} element={<Pages.Signup />}/>
          <Route path='/login' element={<Pages.SignIn />}/>
          <Route path='/dashboard' element={<Pages.Dashboard />}/>
        </Routes>
      </Router>
  )
}

export default App
