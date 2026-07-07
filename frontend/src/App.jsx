import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Onboarding from './pages/Onboarding'
import FirstDump from './pages/FirstDump'
import Processing from './pages/Processing'
import MemoryConfirmed from './pages/MemoryConfirmed'
import Ask from './pages/Ask'
import { useLocation } from 'react-router-dom'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dump" element={<FirstDump />} />
        <Route path="/processing" element={<Processing />} />
        <Route path="/confirmed" element={<MemoryConfirmed />} />
        <Route path="/ask" element={<Ask />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App