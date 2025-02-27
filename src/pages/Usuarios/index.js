import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiEdit2, FiTrash2, FiLock } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import { collection, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import Swal from 'sweetalert2'; // Importação do SweetAlert2
import styles from './users.module.css';

export default function Users() {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', role: '', setor: '' });
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [nomesFantasia, setNomesFantasia] = useState([]); // Estado para armazenar os nomes fantasia

  // Busca os nomes fantasia da tabela customers
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const nomesFantasiaList = snapshot.docs.map((doc) => doc.data().nomeFantasia).filter(Boolean);
      setNomesFantasia(nomesFantasiaList);
    });

    return () => unsubscribe();
  }, []);

  // Atualiza os valores do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData({ nome: '', email: '', password: '', role: '', setor: '' });
    setEditId(null);
  };

  // Registra ou atualiza um usuário
  const handleRegister = async (e) => {
    e.preventDefault();
    const { nome, email, password, role, setor } = formData;

    if (!nome || !email || !role || !setor || (!editId && !password)) {
      toast.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();

      if (editId) {
        await setDoc(doc(db, "users", editId), { nome, email, role, setor });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), { nome, email, role, setor });
        toast.success("Usuário cadastrado com sucesso!");
      }

      clearForm();
    } catch (error) {
      toast.error("Erro ao salvar o usuário: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtém usuários em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usersList);
    });

    return () => unsubscribe();
  }, []);

  // Deleta um usuário com SweetAlert2
  const handleDelete = async (id, email) => {
    const result = await Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const auth = getAuth();
        await deleteDoc(doc(db, "users", id));

        const user = auth.currentUser;
        if (user && user.email === email) {
          await deleteUser(user);
        }

        toast.success('Usuário excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        toast.error('Erro ao excluir usuário.');
      }
    }
  };

  // Reseta a senha do usuário
  const handleResetPassword = async (email) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("E-mail de redefinição de senha enviado!");
    } catch (error) {
      toast.error("Erro ao enviar redefinição de senha: " + error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Usuários">
          <FiUser size={25} />
        </Title>

        <div className={styles.container}>
          <form className={styles.formProfile} onSubmit={handleRegister}>
            <label>
              Nome do Usuário
              <input
                type="text"
                name="nome"
                placeholder="Digite o nome do usuário"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email do Usuário
              <input
                type="email"
                name="email"
                placeholder="Digite o email do usuário"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            {!editId && (
              <label>
                Senha do Usuário
                <input
                  type="password"
                  name="password"
                  placeholder="Digite uma senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            <label>
              Role do Usuário
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Selecione o tipo de perfil</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </label>
            <label>
              Setor do Usuário
              <select name="setor" value={formData.setor} onChange={handleChange} required>
                <option value="">Selecione o setor</option>
                {nomesFantasia.map((nomeFantasia, index) => (
                  <option key={index} value={nomeFantasia}>
                    {nomeFantasia}
                  </option>
                ))}
              </select>
            </label>
            <button className={styles.salvar} type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </form>

          <div className={styles.tableContainer}>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Setor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.role}</td>
                    <td>{usuario.setor}</td>
                    <td>
                      <button
                        className={styles.action}
                        style={{ backgroundColor: '#f6a935' }}
                        onClick={() => setFormData({ ...usuario, password: '' }, setEditId(usuario.id))}
                      >
                        <FiEdit2 color="#FFF" size={17} />
                      </button>
                      <button
                        className={styles.action}
                        style={{ backgroundColor: '#d9534f' }}
                        onClick={() => handleDelete(usuario.id, usuario.email)}
                      >
                        <FiTrash2 color="#FFF" size={17} />
                      </button>
                      <button
                        className={styles.action}
                        style={{ backgroundColor: '#5bc0de' }}
                        onClick={() => handleResetPassword(usuario.email)}
                      >
                        <FiLock color="#FFF" size={17} />
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