import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiEdit2, FiTrash2, FiLock } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import { collection, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import Swal from 'sweetalert2';
import {
  Container,
  FormProfile,
  StyledLabel,
  StyledInput,
  StyledButton,
  TableContainer,
  StyledTable,
  ActionButton,
} from '../../styles/styled-global';

export default function Users() {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', role: '', setor: '' });
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);
  const [nomesFantasia, setNomesFantasia] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customers'), (snapshot) => {
      const nomes = snapshot.docs.map((doc) => doc.data().nomeFantasia).filter(Boolean);
      setNomesFantasia(nomes);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usersList);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({ nome: '', email: '', password: '', role: '', setor: '' });
    setEditId(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { nome, email, password, role, setor } = formData;

    if (!nome || !email || !role || !setor || (!editId && !password)) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();

      if (editId) {
        await setDoc(doc(db, 'users', editId), { nome, email, role, setor });
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        await setDoc(doc(db, 'users', uid), { nome, email, role, setor });
        toast.success('Usuário cadastrado com sucesso!');
      }

      clearForm();
    } catch (error) {
      toast.error('Erro ao salvar o usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
        await deleteDoc(doc(db, 'users', id));
        const user = auth.currentUser;
        if (user && user.email === email) {
          await deleteUser(user);
        }
        toast.success('Usuário excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir usuário: ' + error.message);
      }
    }
  };

  const handleResetPassword = async (email) => {
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('E-mail de redefinição de senha enviado!');
    } catch (error) {
      toast.error('Erro ao enviar redefinição de senha: ' + error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Usuários">
          <FiUser size={25} />
        </Title>

        <Container>
          <FormProfile onSubmit={handleRegister}>
            <StyledLabel>
              Nome do Usuário
              <StyledInput
                type="text"
                name="nome"
                placeholder="Digite o nome do usuário"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </StyledLabel>

            <StyledLabel>
              Email do Usuário
              <StyledInput
                type="email"
                name="email"
                placeholder="Digite o email do usuário"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </StyledLabel>

            {!editId && (
              <StyledLabel>
                Senha do Usuário
                <StyledInput
                  type="password"
                  name="password"
                  placeholder="Digite uma senha"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </StyledLabel>
            )}

            <StyledLabel>
              Role do Usuário
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Selecione o tipo de perfil</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </StyledLabel>

            <StyledLabel>
              Setor do Usuário
              <select name="setor" value={formData.setor} onChange={handleChange} required>
                <option value="">Selecione o setor</option>
                {nomesFantasia.map((nomeFantasia, index) => (
                  <option key={index} value={nomeFantasia}>
                    {nomeFantasia}
                  </option>
                ))}
              </select>
            </StyledLabel>

            <StyledButton type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </StyledButton>
          </FormProfile>

          <TableContainer>
            <StyledTable>
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
                      <ActionButton
                        style={{ backgroundColor: '#f6a935' }}
                        onClick={() => {
                          setFormData({ ...usuario, password: '' });
                          setEditId(usuario.id);
                        }}
                      >
                        <FiEdit2 color="#FFF" size={17} />
                      </ActionButton>
                      <ActionButton
                        style={{ backgroundColor: '#d9534f' }}
                        onClick={() => handleDelete(usuario.id, usuario.email)}
                      >
                        <FiTrash2 color="#FFF" size={17} />
                      </ActionButton>
                      <ActionButton
                        style={{ backgroundColor: '#5bc0de' }}
                        onClick={() => handleResetPassword(usuario.email)}
                      >
                        <FiLock color="#FFF" size={17} />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
        </Container>
      </div>
    </div>
  );
}
