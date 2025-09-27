import { Routes, Route } from 'react-router-dom'
import IntervieweePage from './pages/IntervieweePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<IntervieweePage />} />
      {}
    </Routes>
  )
}

export default App