import { useContext, useState } from 'react';
import avatarImg from '../../assets/avatar.png';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import {
  FiHome,
  FiUser,
  FiSettings,
  FiSlack,
  FiUsers,
  FiBook,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import './header.css';

export default function Header() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [expandContratos, setExpandContratos] = useState(location.pathname.startsWith('/contratos'));

  const toggleContratos = () => setExpandContratos(prev => !prev);

  return (
    <div className="sidebar">
      <div className="avatar-area">
        <img
          src={user.avatarUrl || avatarImg}
          alt="Foto do usuário"
          className="avatar-img"
        />
      </div>

      <Link to="/dashboard">
        <FiHome size={24} />
        Chamados
      </Link>

      {user?.role === 'admin' && (
        <>
          <Link to="/customers">
            <FiUser size={24} />
            Clientes
          </Link>

          <Link to="/users">
            <FiUsers size={24} />
            Usuários
          </Link>

          <Link to="/graphs">
            <FiSlack size={24} />
            Gráficos
          </Link>

          <div className="menu-collapsible">
            <div className="menu-item" onClick={toggleContratos}>
              <FiBook size={24} />
              <span>Contratos</span>
              {expandContratos ? (
                <FiChevronUp size={18} style={{ marginLeft: 'auto' }} />
              ) : (
                <FiChevronDown size={18} style={{ marginLeft: 'auto' }} />
              )}
            </div>

            {expandContratos && (
              <div className="submenu">
                <Link to="/contratos">📄 Ver Contratos</Link>
                <Link to="/contratos/novo">➕ Novo Contrato</Link>
              </div>
            )}
          </div>
        </>
      )}

      <Link to="/profile">
        <FiSettings size={24} />
        Perfil
      </Link>
    </div>
  );
}
