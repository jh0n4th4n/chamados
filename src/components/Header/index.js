import { useContext } from 'react';
import avatarImg from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings, FiSlack, FiUsers, FiMessageCircle } from 'react-icons/fi';
import './header.css';

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuário" />
      </div>

      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>

      {/* Renderiza o link para Clientes apenas se o usuário for admin */}
      {user && user.role === 'admin' && (
        <Link to="/customers">
          <FiUser color="#FFF" size={24} />
          Clientes
        </Link>
      )}

      {/* Renderiza o link para Usuários apenas se o usuário for admin */}
      {user && user.role === 'admin' && (
        <Link to="/users">
          <FiUsers color="#FFF" size={24} />
          Usuários
        </Link>
      )}

      {/* Renderiza o link para Gráficos apenas se o usuário for admin */}
      {user && user.role === 'admin' && (
        <Link to="/graphs">
          <FiSlack color="#FFF" size={24} />
          Gráficos
        </Link>
      )}

      {/* Link para o Chat */}
      <Link to="/chat">
        <FiMessageCircle color="#FFF" size={24} />
        Chat
      </Link>

      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Perfil
      </Link>
    </div>
  );
}
