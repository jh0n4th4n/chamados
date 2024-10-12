import { useState } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import { auth, db } from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import useAuth from '../../contexts/auth';

export default function Customers() {
  const { user } = useAuth(auth);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false); // Para gerenciar o estado de carregamento

  async function handleRegister(e) {
    e.preventDefault();

    // Verifique se o usuário está autenticado
    if (!user || !user.uid) {
      toast.error("Usuário não autenticado. Por favor, faça o login.");
      return;
    }

    if (nome !== '' && telefone !== '' && endereco !== '') {
      setLoading(true); // Começar o carregamento

      try {
        await addDoc(collection(db, "customers"), {
          nomeFantasia: nome,
          telefone: telefone,
          endereco: endereco,
          userId: user.uid  // Salve o ID do usuário autenticado
        });
        setNome('');
        setTelefone('');
        setEndereco('');
        toast.success("Setor registrado com sucesso!");
      } catch (error) {
        toast.error("Erro ao fazer o cadastro.");
        console.log(error)
      } finally {
        setLoading(false); // Finalizar o carregamento
      }
    } else {
      toast.error("Preencha todos os campos!");
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Nome do Setor</label>
            <input
              type="text"
              placeholder="Nome do setor"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Telefone do Setor</label>
            <input
              type="tel"
              placeholder="(xx) xxxx-xxxx"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <label>Endereço</label>
            <input
              type="text"
              placeholder="(Ex: 1º andar)"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
