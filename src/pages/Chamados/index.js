import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import './chamados.css';

const INITIAL_LIMIT = 10; // Limite inicial de chamados

export default function Dashboard() {
  const { logout, user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT); // Contador de chamados visíveis
  const [notifications, setNotifications] = useState([]); // Estado para notificações

  useEffect(() => {
    const listRef = collection(db, "chamados");

    const unsubscribe = onSnapshot(query(listRef, orderBy('created', 'desc')), (snapshot) => {
      const lista = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        // Inclui todos os chamados na lista
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
          userId: data.userId, // Salva o userId do chamado
        });

        // Notifica o usuário comum sobre alterações nos chamados que ele criou
        if (user.role === 'common' && data.userId === user.uid) {
          setNotifications(prev => [...prev, `O chamado "${data.assunto}" foi atualizado!`]);
        }
      });

      // Ordena a lista com base no status desejado
      const orderedLista = lista.sort((a, b) => {
        const statusOrder = {
          'Aberto': 1,
          'Em Progresso': 2,
          'Atendido': 3
        };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setChamados(orderedLista);
      setLoading(false);
      setIsEmpty(orderedLista.length === 0); // Define isEmpty baseado na lista de chamados
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

  async function addChamado(chamado) {
    const docRef = await addDoc(collection(db, "chamados"), {
      ...chamado,
      userId: user.uid, // Adicione o userId aqui para que o chamado seja associado ao usuário logado
      created: new Date(),
    });
    setChamados((prev) => [
      ...prev,
      {
        ...chamado,
        id: docRef.id,
        createdFormat: format(new Date(), 'dd/MM/yyyy HH:mm:ss a'), // Formatação da data
      },
    ]);
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

        {/* Exibir notificações na parte superior da tela */}
        {notifications.length > 0 && (
          <div className="notifications">
            {notifications.map((notification, index) => (
              <div key={index} className="notification">{notification}</div>
            ))}
          </div>
        )}

        <>
          {isEmpty ? (
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
                    <th scope="col">Cadastrado em</th>
                    <th scope="col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.slice(0, visibleCount).map((item) => (
                    <tr key={item.id}>
                      <td data-label="Cliente">{item.cliente}</td>
                      <td data-label="Assunto">{item.assunto}</td>
                      <td data-label="Status">
                        <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status === 'Atendido' ? '#999999' : '#f0ad4e' }}>
                          {item.status}
                        </span>
                      </td>
                      <td data-label="Cadastrado">{item.createdFormat}</td>
                      <td data-label="Ações">
                        <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                          <FiSearch color='#FFF' size={17} />
                        </button>
                        {(user.role === 'admin' || item.userId === user.uid) && ( // Adiciona a condição para administradores
                          <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit2 color='#FFF' size={17} />
                          </Link>
                        )}
                        {user.role === 'admin' && ( // Apenas administradores podem deletar
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
