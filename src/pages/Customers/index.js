import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { auth, db } from '../../services/firebaseConnection';
import { addDoc, collection, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import useAuth from '../../contexts/auth';
import Swal from 'sweetalert2'; // Importação do SweetAlert2
import styles from './customer.module.css'; // Usando CSS Module

export default function Customers() {
  const { user } = useAuth(auth);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    if (nome !== '' && telefone !== '' && endereco !== '') {
      setLoading(true);
      try {
        if (editId) {
          await setDoc(doc(db, "customers", editId), {
            nomeFantasia: nome,
            telefone: telefone,
            endereco: endereco,
          });
          toast.success("Cliente atualizado com sucesso!");
        } else {
          await addDoc(collection(db, "customers"), {
            nomeFantasia: nome,
            telefone: telefone,
            endereco: endereco,
          });
          toast.success("Cliente registrado com sucesso!");
        }
        setNome('');
        setTelefone('');
        setEndereco('');
        setEditId(null);
      } catch (error) {
        toast.error("Erro ao fazer o cadastro: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Preencha todos os campos!");
    }
  }, [nome, telefone, endereco, editId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "customers"), (snapshot) => {
      const clientesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClientes(clientesList);
    });
    return () => unsubscribe();
  }, [user]);

  // Função para deletar cliente com SweetAlert2
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
        <div className={styles.container}>
          {/* Formulário de Cadastro */}
          <form className={styles.formProfile} onSubmit={handleRegister}>
            <label>Nome do Cliente
              <input
                type="text"
                placeholder="Digite o nome do cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </label>
            <label>Telefone do Cliente
              <input
                type="tel"
                placeholder="(99) 9999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </label>
            <label>Endereço
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

          {/* Tabela de Clientes */}
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
                {clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td>{cliente.nomeFantasia}</td>
                    <td>{cliente.telefone}</td>
                    <td>{cliente.endereco}</td>
                    <td>
                      <button className={styles.action} style={{ backgroundColor: '#f6a935' }} onClick={() => handleEdit(cliente)}>
                        <FiEdit2 color='#FFF' size={17} />
                      </button>
                      <button className={styles.action} style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(cliente.id)}>
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