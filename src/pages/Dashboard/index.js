import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2, FiTrash2 } from 'react-icons/fi'; // Importando o ícone de deletar
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, limit, startAfter, query, where, deleteDoc, doc } from 'firebase/firestore'; // Adicionando 'doc'
import { db } from '../../services/firebaseConnection';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import './dashboard.css';


const listRef = collection(db, "chamados");

export default function Dashboard() {
  const { logout, user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState();

  useEffect(() => {
    async function loadChamados() {
      let chamadosQuery;

      // Verifica se o usuário é administrador
      if (user.role === 'admin') {
        // Administradores veem todos os chamados
        chamadosQuery = query(listRef, orderBy('created', 'desc'), limit(5));
      } else {
        // Usuários comuns veem apenas seus próprios chamados
        const userId = user.uid;
        chamadosQuery = query(listRef, where('userId', '==', userId), orderBy('created', 'desc'), limit(5));
      }

      const querySnapshot = await getDocs(chamadosQuery);
      setChamados([]);
      await updateState(querySnapshot);
      setLoading(false);
    }

    loadChamados();

    return () => { }
  }, [user]);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          usuario: doc.data().usuario || user.nome,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy HH:mm:ss a'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      setChamados(chamados => [...chamados, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    if (loadingMore) return;

    setLoadingMore(true);
    let chamadosQuery;

    // Verifica se o usuário é administrador para carregar mais chamados
    if (user.role === 'admin') {
      chamadosQuery = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
    } else {
      const userId = user.uid;
      chamadosQuery = query(listRef, where('userId', '==', userId), orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
    }

    const querySnapshot = await getDocs(chamadosQuery);
    await updateState(querySnapshot);
  }

  async function handleDelete(chamadoId) {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este chamado?");
    if (confirmDelete) {
      await deleteDoc(doc(db, "chamados", chamadoId)); // Deletando o documento no Firestore
      setChamados(chamados.filter(item => item.id !== chamadoId)); // Atualizando a lista localmente
    }
  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
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
                  {chamados.map((item) => (
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
                        <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                          <FiEdit2 color='#FFF' size={17} />
                        </Link>
                        {user.role === 'admin' && ( // Botão de deletar visível apenas para administradores
                          <button className="action" style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(item.id)}>
                            <FiTrash2 color='#FFF' size={17} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
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
