import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import FirstDump from './pages/FirstDump'
import Processing from './pages/Processing'
import MemoryConfirmed from './pages/MemoryConfirmed'
import Ask from './pages/Ask'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dump" element={<FirstDump />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/confirmed" element={<MemoryConfirmed />} />
        <Route path="/ask" element={<Ask />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App