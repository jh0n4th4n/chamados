import { useContext } from 'react';
import avatarImg from '../../assets/avatar.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings, FiSlack, FiUsers, FiBook } from 'react-icons/fi';
import './header.css';

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img 
          src={user.avatarUrl || avatarImg} 
          alt="Foto do usuário" 
        />
      </div>

      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>

      {/* Links exclusivos para o usuário admin */}
      {user?.role === 'admin' && (
        <>
          <Link to="/customers">
            <FiUser color="#FFF" size={24} />
            Clientes
          </Link>
          <Link to="/users">
            <FiUsers color="#FFF" size={24} />
            Usuários
          </Link>
          <Link to="/graphs">
            <FiSlack color="#FFF" size={24} />
            Gráficos
          </Link>
        </>
      )}

      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Perfil
      </Link>

      <Link to="/contratos">
        <FiBook color="#FFF" size={24} />
        Contratos
      </Link>

    </div>
  );
}
