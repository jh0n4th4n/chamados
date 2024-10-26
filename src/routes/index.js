import { Routes, Route } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Chamados from '../pages/Chamados';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import New from '../pages/New';
import Private from './Private';
import Graphs from '../pages/Graficos';
import Users from '../pages/Usuarios';
import NotFound from '../pages/Acesso Negado'; // Importe seu componente de página 404

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/dashboard" element={<Private><Chamados /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/customers" element={<Private><Customers /></Private>} />
      <Route path="/users" element={<Private><Users /></Private>} />
      <Route path="/new" element={<Private><New /></Private>} />
      <Route path="/new/:id" element={<Private><New /></Private>} />
      <Route path="/graphs" element={<Private><Graphs /></Private>} />
      <Route path="*" element={<NotFound />} /> {/* Rota para página não encontrada */}
    </Routes>
  );
}

export default RoutesApp;
