import { useState, useContext } from 'react';
import logo from '../../assets/logo 3.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setor, setSetor] = useState('');
  const [role, setRole] = useState('user'); // Adicionando estado para o papel do usuário

  const { signUp, loadingAuth } = useContext(AuthContext);

  // Definindo os setores em um objeto
  const setores = {
    TI: 'Tecnologia da Informação',
    Farmácia: 'Farmácia',
    Manutenção: 'Manutenção',
    Administrativo: 'Administrativo',
    Limpeza: 'Limpeza'
  };

  // Definindo os papéis disponíveis
  const roles = {
    admin: 'Administrador',
    user: 'Usuário'
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (name !== '' && email !== '' && password !== '' && setor !== '' && role !== '') {
      // Passando o papel do usuário para o método signUp
      await signUp(email, password, name, setor, role);
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Nova conta</h1>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
          >
            <option value="">Selecione seu setor</option>
            {Object.entries(setores).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Selecione seu papel</option>
            {Object.entries(roles).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          <button type="submit">
            {loadingAuth ? 'Carregando...' : 'Cadastrar'}
          </button>
        </form>

        <Link to="/">Já possui uma conta? <strong>Faça login</strong></Link>
      </div>
    </div>
  );
}
