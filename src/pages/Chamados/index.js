import { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import Modal from '../../components/Modal';
import {
  FiPlus, FiMessageSquare, FiEdit2, FiTrash2, FiSearch, FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  collection, onSnapshot, query, orderBy, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { format, isBefore, isAfter, isEqual } from 'date-fns';
import Swal from 'sweetalert2';

// Styled components agrupados em dois arquivos
import {
  Container,
  FormProfile,
  StyledInput,
  StyledSelect,
  TableContainer,
  StyledTable,
  LoadMoreButton,
  ActionButton,
  StyledButton,
  Span
} from '../../styles/styled-global';

import { NewButton } from '../../styles/Buttons';

const INITIAL_LIMIT = 10;

const STATUS_STYLES = {
  Aberto: { backgroundColor: '#28a745', color: '#ffffff' }, // verde Bootstrap success
  Progresso: { backgroundColor: '#ffc107', color: '#212529' }, // amarelo Bootstrap warning
  Atendido: { backgroundColor: '#6c757d', color: '#ffffff' }, // cinza Bootstrap secondary
  Pendente: { backgroundColor: '#fd7e14', color: '#ffffff' }, // laranja escuro Bootstrap orange
  Cancelado: { backgroundColor: '#dc3545', color: '#ffffff' }, // vermelho Bootstrap danger
  Concluído: { backgroundColor: '#007bff', color: '#ffffff' }, // azul Bootstrap primary
};



export default function Chamados() {
  const { user } = useContext(AuthContext);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const [filters, setFilters] = useState({
    status: '',
    dataInicio: '',
    dataFim: '',
    assunto: '',
    cliente: '',
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'chamados'), orderBy('created', 'desc')),
      (snapshot) => {
        let lista = snapshot.docs.map((doc) => {
          const data = doc.data();
          const created = data.created?.toDate?.() || new Date();
          const finalizado = data.finalizadoEm?.toDate?.() || null;

          return {
            id: doc.id,
            ...data,
            created,
            finalizado,
            createdFormat: format(created, 'dd/MM/yyyy HH:mm:ss'),
            finalizadoFormat: finalizado ? format(finalizado, 'dd/MM/yyyy HH:mm:ss') : '—',
          };
        });

        if (user.role !== 'admin') {
          lista = lista.filter((item) => item.setor === user.setor);
        }

        setChamados(lista);
        setIsEmpty(lista.length === 0);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const filteredChamados = useMemo(() => {
    const { status, dataInicio, dataFim, assunto, cliente } = filters;

    return chamados.filter((chamado) => {
      const createdDate = chamado.created;
      const matchStatus = status ? chamado.status === status : true;
      const matchAssunto = assunto ? chamado.assunto === assunto : true;
      const matchCliente = cliente
        ? chamado.cliente.toLowerCase().includes(cliente.toLowerCase())
        : true;

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
        return matchStatus && matchAssunto && matchCliente && isEqual(createdDate, startDate);
      }

      return matchStatus && matchAssunto && matchCliente;
    });
  }, [filters, chamados]);

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
      cliente: '',
    });
  };

  const renderStatusBadge = (status) => (
    <span className="badge" style={STATUS_STYLES[status]}>
      {status}
    </span>
  );

  const toggleModal = (item) => {
    setDetail(item);
    setShowPostModal(!showPostModal);
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Chamados">
          <FiMessageSquare size={25} />
        </Title>

        <Container>
          <FormProfile>
            <Span>Filtros</Span>
            <StyledSelect onChange={(e) => handleFilterChange('status', e.target.value)} value={filters.status}>
              <option value="">Todos os status</option>
              <option value="Aberto">Aberto</option>
              <option value="Progresso">Em Progresso</option>
              <option value="Atendido">Atendido</option>
            </StyledSelect>
            <StyledInput
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            />
            <StyledInput
              type="date"
              value={filters.dataFim}
              onChange={(e) => handleFilterChange('dataFim', e.target.value)}
            />
            <StyledSelect onChange={(e) => handleFilterChange('assunto', e.target.value)} value={filters.assunto}>
              <option value="">Todos os assuntos</option>
              {[...new Set(chamados.map((chamado) => chamado.assunto))].map((assunto, index) => (
                <option key={index} value={assunto}>{assunto}</option>
              ))}
            </StyledSelect>
            {user.role === 'admin' && (
              <StyledInput
                type="text"
                placeholder="Buscar por cliente"
                value={filters.cliente}
                onChange={(e) => handleFilterChange('cliente', e.target.value)}
              />
            )}
            <StyledButton type="button" onClick={clearFilters}>
              <FiX size={15} />
            </StyledButton>
          </FormProfile>

          <NewButton to="/new" className="new">
            <FiPlus color="#FFF" size={25} />
            Novo chamado
          </NewButton>

          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Assunto</th>
                  <th>Status</th>
                  <th>Usuário</th>
                  <th>Setor</th>
                  <th>Cadastrado em</th>
                  <th>Encerrado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredChamados.slice(0, visibleCount).map((item) => (
                  <tr key={item.id}>
                    <td>{item.cliente}</td>
                    <td>{item.assunto}</td>
                    <td>{renderStatusBadge(item.status)}</td>
                    <td>{item.usuario || '—'}</td>
                    <td>{item.setor || '—'}</td>
                    <td>{item.createdFormat}</td>
                    <td>{item.finalizadoFormat}</td>
                    <td>
                      <ActionButton style={{ backgroundColor: '#3583f6' }} onClick={() => toggleModal(item)}>
                        <FiSearch color="#FFF" size={17} />
                      </ActionButton>
                      {(user.role === 'admin' || item.userId === user.uid) && (
                        <Link to={`/new/${item.id}`}>
                          <ActionButton style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit2 color="#FFF" size={17} />
                          </ActionButton>
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <ActionButton style={{ backgroundColor: '#d9534f' }} onClick={() => handleDelete(item.id)}>
                          <FiTrash2 color="#FFF" size={17} />
                        </ActionButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>

            {visibleCount < filteredChamados.length ? (
              <LoadMoreButton onClick={() => setVisibleCount((prev) => prev + INITIAL_LIMIT)}>
                Buscar mais
              </LoadMoreButton>
            ) : (
              visibleCount > INITIAL_LIMIT && (
                <LoadMoreButton onClick={() => setVisibleCount(INITIAL_LIMIT)}>
                  Mostrar menos
                </LoadMoreButton>
              )
            )}
          </TableContainer>
        </Container>

        {showPostModal && <Modal conteudo={detail} close={() => setShowPostModal(false)} />}
      </div>
    </div>
  );
}