import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Veckovy from './pages/Veckovy';
import Dagsvy from './pages/Dagsvy';
import Receptval from './pages/Receptval';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Veckovy />} />
        <Route path="/dag/:dayId" element={<Dagsvy />} />
        <Route path="/dag/:dayId/recept" element={<Receptval />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
