import { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format, isBefore, isAfter, isEqual } from 'date-fns';
import Modal from '../../components/Modal';
import Swal from 'sweetalert2'; // Importação do SweetAlert2
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
    cliente: '', // Novo filtro para buscar por cliente
  });

  // Carrega os chamados e popula o filtro de assuntos
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'chamados'), orderBy('created', 'desc')),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created: doc.data().created.toDate(), // Garante que created seja um objeto Date
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy HH:mm:ss'),
        }));

        setChamados(lista);
        setIsEmpty(lista.length === 0);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtra os chamados com base nos filtros aplicados
  const filteredChamados = useMemo(() => {
    const { status, dataInicio, dataFim, assunto, cliente } = filters;

    return chamados.filter((chamado) => {
      const createdDate = chamado.created;
      const matchStatus = status ? chamado.status === status : true;
      const matchAssunto = assunto ? chamado.assunto === assunto : true;
      const matchCliente = cliente
        ? chamado.cliente.toLowerCase().includes(cliente.toLowerCase())
        : true;

      // Filtro por período de datas
      if (dataInicio && dataFim) {
        const startDate = new Date(dataInicio);
        const endDate = new Date(dataFim);
        return (
          matchStatus &&
          matchAssunto &&
          matchCliente &&
          (isEqual(createdDate, startDate) ||
            isEqual(createdDate, endDate) ||
            (isAfter(createdDate, startDate) && isBefore(createdDate, endDate)))
        );
      } else if (dataInicio) {
        const startDate = new Date(dataInicio);
        return (
          matchStatus &&
          matchAssunto &&
          matchCliente &&
          isEqual(createdDate, startDate)
        );
      }

      return matchStatus && matchAssunto && matchCliente;
    });
  }, [filters, chamados]);

  // Função para deletar chamado com SweetAlert2
  const handleDelete = async (id) => {
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
        await deleteDoc(doc(db, 'chamados', id));
        setChamados((prev) => prev.filter((chamado) => chamado.id !== id));

        Swal.fire({
          title: 'Deletado!',
          text: 'O chamado foi deletado com sucesso.',
          icon: 'success',
        });
      } catch (error) {
        console.error('Erro ao deletar chamado:', error);
        Swal.fire({
          title: 'Erro!',
          text: 'Ocorreu um erro ao deletar o chamado.',
          icon: 'error',
        });
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      dataInicio: '',
      dataFim: '',
      assunto: '',
      cliente: '', // Limpa o filtro de cliente
    });
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
            {[...new Set(chamados.map((chamado) => chamado.assunto))].map((assunto, index) => (
              <option key={index} value={assunto}>
                {assunto}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Buscar por cliente"
            onChange={(e) => handleFilterChange('cliente', e.target.value)}
            value={filters.cliente}
          />
          <button className="clear-filters" onClick={clearFilters}>
            <FiX size={15} />
          </button>
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
            {visibleCount < filteredChamados.length ? (
              <button className="btn-more" onClick={() => setVisibleCount((prev) => prev + INITIAL_LIMIT)}>
                Buscar mais
              </button>
            ) : (
              visibleCount > INITIAL_LIMIT && (
                <button className="btn-more" onClick={() => setVisibleCount(INITIAL_LIMIT)}>
                  Mostrar menos
                </button>
              )
            )}
          </>
        )}

        {showPostModal && <Modal conteudo={detail} close={() => setShowPostModal(false)} />}
      </div>
    </div>
  );
}