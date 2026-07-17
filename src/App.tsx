import { Navigate, Route, Routes } from 'react-router-dom';
import { CalculatorPage } from './pages/CalculatorPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CalculatorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
