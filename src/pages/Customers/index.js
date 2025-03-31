import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { auth, db } from '../../services/firebaseConnection';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import useAuth from '../../contexts/auth';
import Swal from 'sweetalert2';
import {
  Container,
  FormProfile,
  StyledLabel,
  StyledInput,
  StyledButton,
  TableContainer,
  StyledTable,
  LoadMoreButton,
  ActionButton,
} from '../../styles/styled-global';

const INITIAL_LIMIT = 10;

export default function Customers() {
  const { user } = useAuth(auth);

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    if (nome !== '' && telefone !== '' && endereco !== '') {
      setLoading(true);
      try {
        if (editId) {
          await setDoc(doc(db, 'customers', editId), {
            nomeFantasia: nome,
            telefone,
            endereco,
          });
          toast.success('Cliente atualizado com sucesso!');
        } else {
          await addDoc(collection(db, 'customers'), {
            nomeFantasia: nome,
            telefone,
            endereco,
          });
          toast.success('Cliente registrado com sucesso!');
        }
        setNome('');
        setTelefone('');
        setEndereco('');
        setEditId(null);
      } catch (error) {
        toast.error('Erro ao fazer o cadastro: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Preencha todos os campos!');
    }
  }, [nome, telefone, endereco, editId]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'customers'),
        orderBy('nomeFantasia'),
        limit(INITIAL_LIMIT)
      );

      if (lastDoc) {
        q = query(
          collection(db, 'customers'),
          orderBy('nomeFantasia'),
          startAfter(lastDoc),
          limit(INITIAL_LIMIT)
        );
      }

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const newClientes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClientes((prev) => [...prev, ...newClientes]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        if (snapshot.docs.length < INITIAL_LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      toast.error('Erro ao carregar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialCustomers = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'customers'),
          orderBy('nomeFantasia'),
          limit(INITIAL_LIMIT)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const initialClientes = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setClientes(initialClientes);
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

          if (snapshot.docs.length < INITIAL_LIMIT) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        toast.error('Erro ao carregar clientes: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCustomers();
  }, []);

  const handleDelete = useCallback(async (id) => {
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
        await deleteDoc(doc(db, 'customers', id));
        setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
        toast.success('Cliente excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        toast.error('Erro ao excluir cliente.');
      }
    }
  }, []);

  const handleEdit = useCallback((cliente) => {
    setNome(cliente.nomeFantasia);
    setTelefone(cliente.telefone);
    setEndereco(cliente.endereco);
    setEditId(cliente.id);
  }, []);

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>
        <Container>
          <FormProfile onSubmit={handleRegister}>
            <StyledLabel>
              Nome do Cliente
              <StyledInput
                type="text"
                placeholder="Digite o nome do cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </StyledLabel>
            <StyledLabel>
              Telefone do Cliente
              <StyledInput
                type="tel"
                placeholder="(99) 9999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </StyledLabel>
            <StyledLabel>
              Endereço
              <StyledInput
                type="text"
                placeholder="Ex: 1º andar"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
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
                  <th>Telefone</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.nomeFantasia}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.endereco}</td>
                    <td>
                      <ActionButton
                        style={{ backgroundColor: '#f6a935' }}
                        onClick={() => handleEdit(cliente)}
                      >
                        <FiEdit2 color="#FFF" size={17} />
                      </ActionButton>
                      <ActionButton
                        style={{ backgroundColor: '#d9534f' }}
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <FiTrash2 color="#FFF" size={17} />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            {hasMore && (
              <LoadMoreButton onClick={loadCustomers} disabled={loading}>
                {loading ? 'Carregando...' : 'Carregar mais'}
              </LoadMoreButton>
            )}
          </TableContainer>
        </Container>
      </div>
    </div>
  );
}
