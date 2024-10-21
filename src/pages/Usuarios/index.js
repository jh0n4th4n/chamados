import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import { addDoc, collection, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import styles from './users.module.css'; // CSS Module para estilização

export default function Users() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);

  // Função para cadastrar ou editar usuário
  async function handleRegister(e) {
    e.preventDefault();

    if (nome !== '' && email !== '' && role !== '') {
      setLoading(true);

      try {
        if (editId) {
          // Atualiza usuário existente
          await setDoc(doc(db, "users", editId), {
            nome,
            email,
            role,
          });
          toast.success("Usuário atualizado com sucesso!");
        } else {
          // Adiciona novo usuário
          await addDoc(collection(db, "users"), {
            nome,
            email,
            role,
          });
          toast.success("Usuário cadastrado com sucesso!");
        }

        // Limpa os campos após o cadastro
        setNome('');
        setEmail('');
        setRole('');
        setEditId(null);
      } catch (error) {
        toast.error("Erro ao cadastrar usuário.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Preencha todos os campos!");
    }
  }

  // Função para buscar os usuários cadastrados
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usersList);
    });

    return () => unsubscribe();
  }, []);

  // Função para deletar um usuário
  async function handleDelete(id) {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "users", id));
      toast.success("Usuário excluído com sucesso!");
    }
  }

  // Função para editar um usuário
  function handleEdit(usuario) {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setRole(usuario.role);
    setEditId(usuario.id);
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Usuários">
          <FiUser size={25} />
        </Title>

        <div className={styles.container}>
          {/* Formulário de Cadastro */}
          <form className={styles.formProfile} onSubmit={handleRegister}>
            <label>Nome do Usuário
              <input
                type="text"
                placeholder="Digite o nome do usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>

            <label>Email do Usuário
              <input
                type="email"
                placeholder="Digite o email do usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>Role do Usuário
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Selecione o tipo de perfil</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </label>

            <button className={styles.salvar} type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>

          {/* Tabela de Usuários */}
          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.role}</td>
                    <td>
                      <button className={styles.action} style={{ backgroundColor: '#f6a935' }} onClick={() => handleEdit(usuario)}>
                        <FiEdit2 color='#FFF' size={17} />
                      </button>
                      <button className={styles.action} style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(usuario.id)}>
                        <FiTrash2 color='#FFF' size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
