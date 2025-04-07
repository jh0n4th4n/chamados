import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

import avatarImg from '../../assets/avatar.png';
import { AuthContext } from '../../contexts/auth';
import './header.css';

export default function Header() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [expandContratos, setExpandContratos] = useState(
    location.pathname.startsWith('/contratos')
  );

  const toggleContratos = () => setExpandContratos(prev => !prev);

  return (
    <div className="sidebar">
      <div className="avatar-area">
        <img
          src={user?.avatarUrl || avatarImg}
          alt="Foto do usuário"
          className="avatar-img"
        />
      </div>

      <nav className="sidebar-menu">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          <FiHome size={20} />
          <span>Chamados</span>
        </Link>

        {user?.role === 'admin' && (
          <>
            <Link to="/customers" className={location.pathname === '/customers' ? 'active' : ''}>
              <FiUser size={20} />
              <span>Clientes</span>
            </Link>

            <Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>
              <FiUsers size={20} />
              <span>Usuários</span>
            </Link>

            <Link to="/graphs" className={location.pathname === '/graphs' ? 'active' : ''}>
              <FiSlack size={20} />
              <span>Gráficos</span>
            </Link>

            <div className="menu-collapsible">
              <div className="menu-item" onClick={toggleContratos}>
                <FiBook size={20} />
                <span>Contratos</span>
                {expandContratos ? (
                  <FiChevronUp size={18} className="chevron-icon" />
                ) : (
                  <FiChevronDown size={18} className="chevron-icon" />
                )}
              </div>

              {expandContratos && (
                <div className="submenu">
                  <Link to="/contratos">➕ Novo Contrato</Link>
                  <Link to="/contratos/novo">📄 Ver Contratos</Link>
                </div>
              )}
            </div>
          </>
        )}

        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          <FiSettings size={20} />
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
