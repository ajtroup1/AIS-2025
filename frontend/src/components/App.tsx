import '../css/App.css'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/profile" element={ <Profile /> } /> */}
          {/* ... */}
        </Routes>
      </main>
      {/* <Footer /> */}
    </>
  )
}

export default App
