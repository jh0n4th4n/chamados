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
import styles from './customer.module.css';

// Limite de clientes por página
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

  // Cadastrar ou editar cliente
  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      if (nome !== '' && telefone !== '' && endereco !== '') {
        setLoading(true);
        try {
          if (editId) {
            await setDoc(doc(db, 'customers', editId), {
              nomeFantasia: nome,
              telefone: telefone,
              endereco: endereco,
            });
            toast.success('Cliente atualizado com sucesso!');
          } else {
            await addDoc(collection(db, 'customers'), {
              nomeFantasia: nome,
              telefone: telefone,
              endereco: endereco,
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
    },
    [nome, telefone, endereco, editId]
  );

  // Carrega clientes com paginação
  const loadCustomers = useCallback(async () => {
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
  }, [lastDoc]);

  useEffect(() => {
    loadCustomers();
  }, []);

  // Deletar cliente com confirmação
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

  // Editar cliente (preencher formulário)
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
        <div className={styles.container}>
          {/* Formulário */}
          <form className={styles.formProfile} onSubmit={handleRegister}>
            <label>
              Nome do Cliente
              <input
                type="text"
                placeholder="Digite o nome do cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>
            <label>
              Telefone do Cliente
              <input
                type="tel"
                placeholder="(99) 9999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </label>
            <label>
              Endereço
              <input
                type="text"
                placeholder="Ex: 1º andar"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </label>
            <button className={styles.salvar} type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </form>

          {/* Tabela */}
          <div className={styles.tableContainer}>
            <table>
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
                      <button
                        className={styles.action}
                        style={{ backgroundColor: '#f6a935' }}
                        onClick={() => handleEdit(cliente)}
                      >
                        <FiEdit2 color="#FFF" size={17} />
                      </button>
                      <button
                        className={styles.action}
                        style={{ backgroundColor: '#d9534f' }}
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <FiTrash2 color="#FFF" size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Botão Carregar Mais */}
            {hasMore && (
              <button
                className={styles.btnMore}
                onClick={loadCustomers}
                disabled={loading}
                style={{ marginTop: '20px' }}
              >
                {loading ? 'Carregando...' : 'Carregar mais'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
