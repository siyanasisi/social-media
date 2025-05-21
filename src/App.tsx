import { Home } from './pages/Home'
import { Navbar } from './components/Navbar'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <div>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
