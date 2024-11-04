import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import './chamados.css';

const INITIAL_LIMIT = 10;

export default function Chamados() {
  const { user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [filteredChamados, setFilteredChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);

  // Filtros
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDataInicio, setFilterDataInicio] = useState('');
  const [filterDataFim, setFilterDataFim] = useState('');

  useEffect(() => {
    const listRef = collection(db, "chamados");

    const unsubscribe = onSnapshot(query(listRef, orderBy('created', 'desc')), (snapshot) => {
      const lista = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdFormat: format(data.created.toDate(), 'dd/MM/yyyy HH:mm:ss'),
        };
      });

      setChamados(lista);
      setFilteredChamados(lista);
      setLoading(false);
      setIsEmpty(lista.length === 0);
    });

    return () => unsubscribe();
  }, []);

  // Função para aplicação dos filtros
  useEffect(() => {
    const filterChamados = () => {
      const filtered = chamados.filter((chamado) => {
        const createdDate = chamado.created.toDate();
        const matchStatus = filterStatus ? chamado.status === filterStatus : true;
        const matchPeriodo = filterDataInicio
          ? filterDataFim
            ? createdDate >= new Date(filterDataInicio) && createdDate <= new Date(filterDataFim)
            : format(createdDate, 'yyyy-MM-dd') === format(new Date(filterDataInicio), 'yyyy-MM-dd')
          : true;

        return matchStatus && matchPeriodo;
      });

      setFilteredChamados(filtered);
      setVisibleCount(INITIAL_LIMIT); // Resetar contagem ao aplicar filtros
    };

    filterChamados();
  }, [chamados, filterStatus, filterDataInicio, filterDataFim]);

  function toggleModal(item) {
    console.log('toggle modal');
    setDetail(item); // Define detail com o item clicado
    setShowPostModal(!showPostModal); // Alterna o estado do modal
  }

  async function handleDelete(chamadoId) {
    const confirmDelete = window.confirm("Você tem certeza que deseja deletar este chamado?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "chamados", chamadoId));
        setChamados((prev) => prev.filter((item) => item.id !== chamadoId));
        setFilteredChamados((prev) => prev.filter((item) => item.id !== chamadoId));
      } catch (error) {
        console.error("Erro ao deletar chamado:", error);
      }
    }
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + INITIAL_LIMIT);
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

        <div className="filters">
          <span>Filtros</span>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em Progresso">Em Progresso</option>
            <option value="Atendido">Atendido</option>
          </select>
          <input
            type="date"
            placeholder="Data início"
            value={filterDataInicio}
            onChange={(e) => setFilterDataInicio(e.target.value)}
          />
          <input
            type="date"
            placeholder="Data fim"
            value={filterDataFim}
            onChange={(e) => setFilterDataFim(e.target.value)}
          />
        </div>

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
                {filteredChamados.slice(0, visibleCount).map((item) => (
                  <tr key={item.id}>
                    <td data-label="Cliente" className="efectLin">{item.cliente}</td>
                    <td data-label="Assunto" className="efectLin">{item.assunto}</td>
                    <td data-label="Status" className="efectLin">
                      <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : item.status === 'Atendido' ? '#999999' : '#f0ad4e' }}>
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Cadastrado">{item.createdFormat}</td>
                    <td data-label="Ações" className="efectLin">
                      <button className="action" style={{ backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                        <FiSearch color="#FFF" size={17} />
                      </button>
                      {(user.role === 'admin' || item.userId === user.uid) && (
                        <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <button className="action" style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(item.id)}>
                          <FiTrash2 color="#FFF" size={17} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleCount < filteredChamados.length && (
              <button className="btn-more" onClick={handleLoadMore}>Buscar mais</button>
            )}
          </>
        )}

        {showPostModal && (
          <Modal
            conteudo={detail}
            close={() => setShowPostModal(false)}
          />
        )}
      </div>
    </div>
  );
}
