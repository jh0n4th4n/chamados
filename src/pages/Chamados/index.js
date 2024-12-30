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

// Limite inicial para a paginação
const INITIAL_LIMIT = 10;

// Estilos de status reutilizáveis
const STATUS_STYLES = {
  Aberto: { backgroundColor: '#5cb85c' },
  Progresso: { backgroundColor: '#f0ad4e' },
  Atendido: { backgroundColor: '#999999' },
};

export default function Chamados() {
  const { user } = useContext(AuthContext);

  // Estados principais
  const [chamados, setChamados] = useState([]);
  const [filteredChamados, setFilteredChamados] = useState([]);
  const [assuntos, setAssuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  // Modal e detalhamento
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState(null);

  // Paginação e Filtros
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const [filters, setFilters] = useState({
    status: '',
    dataInicio: '',
    dataFim: '',
    assunto: '',
  });

  // Carrega os chamados e popula o filtro de assuntos
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'chamados'), orderBy('created', 'desc')),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy HH:mm:ss'),
        }));

        setChamados(lista);
        setFilteredChamados(lista);
        setIsEmpty(lista.length === 0);
        setLoading(false);

        // Popula os assuntos únicos
        const uniqueAssuntos = Array.from(new Set(lista.map((chamado) => chamado.assunto)));
        setAssuntos(uniqueAssuntos);
      }
    );

    return () => unsubscribe();
  }, []);

  // Atualiza os chamados filtrados com base nos filtros aplicados
  useEffect(() => {
    const applyFilters = () => {
      const { status, dataInicio, dataFim, assunto } = filters;

      const filtered = chamados.filter((chamado) => {
        const createdDate = chamado.created.toDate();
        const matchStatus = status ? chamado.status === status : true;
        const matchPeriodo = dataInicio
          ? dataFim
            ? createdDate >= new Date(dataInicio) && createdDate <= new Date(dataFim)
            : format(createdDate, 'yyyy-MM-dd') === format(new Date(dataInicio), 'yyyy-MM-dd')
          : true;
        const matchAssunto = assunto ? chamado.assunto === assunto : true;

        return matchStatus && matchPeriodo && matchAssunto;
      });

      setFilteredChamados(filtered);
      setVisibleCount(INITIAL_LIMIT); // Reseta a contagem de itens visíveis
    };

    applyFilters();
  }, [filters, chamados]);

  // Funções auxiliares
  const handleDelete = async (id) => {
    if (window.confirm('Você tem certeza que deseja deletar este chamado?')) {
      try {
        await deleteDoc(doc(db, 'chamados', id));
        setChamados((prev) => prev.filter((chamado) => chamado.id !== id));
      } catch (error) {
        console.error('Erro ao deletar chamado:', error);
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const renderStatusBadge = (status) => (
    <span className="badge" style={STATUS_STYLES[status]}>
      {status}
    </span>
  );

  // Exibe o modal com os detalhes
  const toggleModal = (item) => {
    setDetail(item);
    setShowPostModal(!showPostModal);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Chamados">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Carregando chamados...</span>
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
        <hr />

        <div className="filters">
          <span>Filtros</span>
          <select onChange={(e) => handleFilterChange('status', e.target.value)} value={filters.status}>
            <option value="">Todos os status</option>
            <option value="Aberto">Aberto</option>
            <option value="Progresso">Em Progresso</option>
            <option value="Atendido">Atendido</option>
          </select>
          <input
            type="date"
            onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            value={filters.dataInicio}
          />
          <input
            type="date"
            onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            value={filters.dataFim}
          />
          <select onChange={(e) => handleFilterChange('assunto', e.target.value)} value={filters.assunto}>
            <option value="">Todos os assuntos</option>
            {assuntos.map((assunto, index) => (
              <option key={index} value={assunto}>
                {assunto}
              </option>
            ))}
          </select>
        </div>

        <hr />

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
                  <th>Cliente</th>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Cadastrado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredChamados.slice(0, visibleCount).map((item) => (
                  <tr key={item.id}>
                    <td>{item.cliente}</td>
                    <td>{item.assunto}</td>
                    <td>{renderStatusBadge(item.status)}</td>
                    <td>{item.createdFormat}</td>
                    <td>
                      <button
                        className="action"
                        style={{ backgroundColor: '#3583f6' }}
                        onClick={() => toggleModal(item)}
                      >
                        <FiSearch color="#FFF" size={17} />
                      </button>
                      {(user.role === 'admin' || item.userId === user.uid) && (
                        <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                          <FiEdit2 color="#FFF" size={17} />
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <button
                          className="action"
                          style={{ backgroundColor: '#d9534f' }}
                          onClick={() => handleDelete(item.id)}
                        >
                          <FiTrash2 color="#FFF" size={17} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleCount < filteredChamados.length && (
              <button className="btn-more" onClick={() => setVisibleCount((prev) => prev + INITIAL_LIMIT)}>
                Buscar mais
              </button>
            )}
          </>
        )}

        {showPostModal && <Modal conteudo={detail} close={() => setShowPostModal(false)} />}
      </div>
    </div>
  );
}
