import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import './dashboard.css';

const INITIAL_LIMIT = 10; // Limite inicial de chamados

export default function Dashboard() {
  const { logout, user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT); // Contador de chamados visíveis

  useEffect(() => {
    const listRef = collection(db, "chamados");

    // Função para escutar alterações em tempo real
    const unsubscribe = onSnapshot(query(listRef, orderBy('created', 'desc')), (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // Inclui apenas chamados dos usuários comuns (se você tem alguma lógica para identificar)
        if (data.userId !== user.uid || user.role === 'admin') {
          lista.push({
            id: doc.id,
            usuario: data.usuario || user.nome,
            assunto: data.assunto,
            cliente: data.cliente,
            clienteId: data.clienteId,
            created: data.created,
            createdFormat: format(data.created.toDate(), 'dd/MM/yyyy HH:mm:ss a'),
            status: data.status,
            complemento: data.complemento,
          });
        }
      });

      setChamados(lista);
      setLoading(false);
      setIsEmpty(lista.length === 0); // Define isEmpty baseado na lista de chamados
    });

    return () => unsubscribe(); // Limpa o listener ao desmontar o componente
  }, [user]);

  async function handleDelete(chamadoId) {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este chamado?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "chamados", chamadoId)); // Deletando o documento no Firestore
    }
  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + INITIAL_LIMIT); // Aumenta o número de chamados visíveis
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrando em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.slice(0, visibleCount).map((item) => (
                    <tr key={item.id}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                          {item.status}
                        </span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormat}</td>
                      <td data-label="Ações">
                        <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                          <FiSearch color='#FFF' size={17} />
                        </button>
                        <button to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                          <FiEdit2 color='#FFF' size={17} />
                        </button>
                        {user.role === 'admin' && (
                          <button className="action" style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(item.id)}>
                            <FiTrash2 color='#FFF' size={17} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibleCount < chamados.length && ( // Verifica se há mais chamados para carregar
                <button className="btn-more" onClick={handleLoadMore}>Buscar mais</button>
              )}
            </>
          )}
        </>
      </div>

      {showPostModal && (
        <Modal
          conteudo={detail}
          close={() => setShowPostModal(!showPostModal)}
        />
      )}
    </div>
  );
}
