import { useState, useContext } from 'react';
import './signin.css';
import logo from '../../assets/logo 3.png';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify'; // Para mostrar mensagens de feedback

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn, loadingAuth } = useContext(AuthContext);

  async function handleSignIn(e) {
    e.preventDefault();

    // Validação simples para verificar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    if (email !== '' && password !== '') {
      try {
        await signIn(email, password);
      } catch (error) {
        toast.error("Erro ao tentar fazer login: " + error.message);
      }
    } else {
      toast.error("Por favor, preencha todos os campos.");
    }
  }

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
          />

          <button type="submit" disabled={loadingAuth}>
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>
      </div>
    </div>
  );
}
