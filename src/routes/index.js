import { Routes, Route } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Chamados from '../pages/Chamados';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import New from '../pages/New';
import Private from './Private';
import Graphs from '../pages/Graficos';
import Users from '../pages/Usuarios';
import NotFound from '../pages/Acesso Negado';
import Contratos from '../pages/Contratos';
import Contratostable from '../pages/Contratos/contratos';

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />

      {/* Rotas acessíveis a todos os usuários logados */}
      <Route path="/dashboard" element={<Private><Chamados /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/customers" element={<Private><Customers /></Private>} />
      <Route path="/new" element={<Private><New /></Private>} />
      <Route path="/new/:id" element={<Private><New /></Private>} />

      {/* Rotas exclusivas para administradores */}
      <Route path="/users" element={<Private role="admin"><Users /></Private>} />
      <Route path="/graphs" element={<Private role="admin"><Graphs /></Private>} />
      <Route path="/contratos" element={<Private role="admin"><Contratos /></Private>} />
      <Route path="/contratos/novo" element={<Private role="admin"><Contratostable /></Private>} />

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesApp;
