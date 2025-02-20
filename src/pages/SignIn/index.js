import { useState, useContext } from 'react';
import './signin.css';
import logo from '../../assets/logo 3.png';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn, loadingAuth } = useContext(AuthContext);

  // Função para validar o formato do email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para lidar com o login
  const handleSignIn = async (e) => {
    e.preventDefault();

    // Validação do email
    if (!validateEmail(email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    // Validação da senha
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      toast.error("Erro ao tentar fazer login: " + error.message);
    }
  };

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="Logo do sistema de chamados" />
        </div>

        <form onSubmit={handleSignIn}>
          <h1>Entrar</h1>

          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Endereço de Email"
          />

          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Senha"
            minLength={6}
          />

          <button type="submit" disabled={loadingAuth}>
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}