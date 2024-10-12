import { useState, useContext } from 'react';
import logo from '../../assets/logo 3.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setor, setSetor] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();

    if (name !== '' && email !== '' && password !== '' && setor !== '') {
      await signUp(email, password, name, setor);
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
            <option value="TI">TI</option>
            <option value="Farmácia">Farmácia</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Administrativo">Administrativo</option>
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
