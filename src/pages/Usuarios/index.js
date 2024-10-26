import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiEdit2, FiTrash2, FiLock } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import { collection, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import styles from './users.module.css';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";

export default function Users() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();

    if (nome && email && role && password) {
      setLoading(true);

      try {
        const auth = getAuth();

        if (editId) {
          // Atualiza usuário existente
          await setDoc(doc(db, "users", editId), {
            nome,
            email,
            role,
          });
          toast.success("Usuário atualizado com sucesso!");
        } else {
          // Cria o usuário no Firebase Authentication e salva no Firestore
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const uid = userCredential.user.uid;

          await setDoc(doc(db, "users", uid), {
            nome,
            email,
            role,
          });
          toast.success("Usuário cadastrado com sucesso no sistema!");
        }

        // Limpa os campos após o cadastro
        setNome('');
        setEmail('');
        setPassword('');
        setRole('');
        setEditId(null);
      } catch (error) {
        toast.error("Erro ao cadastrar usuário: " + error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Preencha todos os campos!");
    }
  }

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

  async function handleDelete(id, email) {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmDelete) {
      try {
        const auth = getAuth();
        await deleteDoc(doc(db, "users", id));

        const user = auth.currentUser;
        if (user && user.email === email) {
          await deleteUser(user);
          toast.success("Usuário excluído com sucesso!");
        } else {
          toast.error("Erro ao excluir o usuário de autenticação.");
        }
      } catch (error) {
        toast.error("Erro ao excluir o usuário: " + error.message);
        console.log(error);
      }
    }
  }

  function handleEdit(usuario) {
    setNome(usuario.nome);
    setEmail(usuario.email);
    setRole(usuario.role);
    setEditId(usuario.id);
  }

  async function handleResetPassword(email) {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("E-mail de redefinição de senha enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar e-mail de redefinição de senha: " + error.message);
      console.log(error);
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Usuários">
          <FiUser size={25} />
        </Title>

        <div className={styles.container}>
          <form className={styles.formProfile} onSubmit={handleRegister}>
            <label>Nome do Usuário
              <input
                type="text"
                placeholder="Digite o nome do usuário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>

            <label>Email do Usuário
              <input
                type="email"
                placeholder="Digite o email do usuário"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label>Senha do Usuário
              <input
                type="password"
                placeholder="Digite uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <label>Role do Usuário
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
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
                      <button className={styles.action} style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(usuario.id, usuario.email)}>
                        <FiTrash2 color='#FFF' size={17} />
                      </button>
                      <button className={styles.action} style={{ backgroundColor: '#5bc0de' }} onClick={() => handleResetPassword(usuario.email)}>
                        <FiLock color='#FFF' size={17} />
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
