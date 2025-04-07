import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import Title from '../../components/Title';
import {
  FiBook, FiSearch, FiEdit2, FiTrash2, FiPlus, FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  collection, onSnapshot, query, orderBy, deleteDoc, doc
} from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Swal from 'sweetalert2';

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
import ModalContrato from './modal_contratos';
import { differenceInDays, parseISO } from 'date-fns';

const INITIAL_LIMIT = 10;

export default function Contratos() {
  const { user } = useContext(AuthContext);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
  const [filters, setFilters] = useState({ cliente: '', status: '' });
  const [selectedContrato, setSelectedContrato] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, 'contratos'), orderBy('created', 'desc')),
      (snapshot) => {
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setContratos(lista);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filteredContratos = contratos.filter(c => {
    const matchCliente = filters.cliente
      ? c.empresaContratada?.toLowerCase().includes(filters.cliente.toLowerCase())
      : true;
    const matchStatus = filters.status ? c.status === filters.status : true;
    return matchCliente && matchStatus;
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja excluir este contrato?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, 'contratos', id));
      Swal.fire('Excluído!', 'Contrato removido com sucesso.', 'success');
    }
  };

  const handleView = (contrato) => {
    setSelectedContrato(contrato);
    setShowModal(true);
  };

  const getDiasRestantes = (dataFim) => {
    try {
      const dias = differenceInDays(parseISO(dataFim), new Date());
      return dias;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Contratos">
          <FiBook size={25} />
        </Title>

        <Container>
          <FormProfile>
            <Span>Filtros</Span>
            <StyledInput
              type="text"
              placeholder="Buscar por empresa contratada"
              value={filters.cliente}
              onChange={(e) => setFilters(prev => ({ ...prev, cliente: e.target.value }))}
            />
            <StyledSelect
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Todos os status</option>
              <option value="Ativo">Ativo</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Pendente">Pendente</option>
              <option value="Finalizado">Finalizado</option>
            </StyledSelect>
            <StyledButton type="button" onClick={() => setFilters({ cliente: '', status: '' })}>
              <FiX size={15} />
            </StyledButton>
          </FormProfile>

          <NewButton to="/contratos" className="new">
            <FiPlus color="#FFF" size={25} />
            Novo Contrato
          </NewButton>

          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <th>Nº Contrato</th>
                  <th>Empresa Contratada</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredContratos.slice(0, visibleCount).map((item) => {
                  const diasRestantes = item.dataFim ? getDiasRestantes(item.dataFim) : null;
                  const vencendo = diasRestantes !== null && diasRestantes <= 60;
                  return (
                    <tr
                      key={item.id}
                      style={{ backgroundColor: vencendo ? '#fff8e1' : 'transparent' }}
                    >
                      <td>{item.numeroContrato || '—'}</td>
                      <td>{item.empresaContratada || '—'}</td>
                      <td>{item.dataInicio || '—'}</td>
                      <td>{item.dataFim || '—'}</td>
                      <td>{item.valorTotal || '—'}</td>
                      <td>
                        {item.status || '—'}
                        {vencendo && diasRestantes >= 0 && (
                          <span style={{ marginLeft: 8, color: '#d84315', fontWeight: 'bold' }}>
                            ({diasRestantes} dias)
                          </span>
                        )}
                      </td>
                      <td>
                        <ActionButton
                          style={{ backgroundColor: '#3583f6' }}
                          onClick={() => handleView(item)}
                        >
                          <FiSearch color="#FFF" size={17} />
                        </ActionButton>
                        <Link to={`/contratos/${item.id}`}>
                          <ActionButton style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit2 color="#FFF" size={17} />
                          </ActionButton>
                        </Link>
                        {user.role === 'admin' && (
                          <ActionButton
                            style={{ backgroundColor: '#d9534f' }}
                            onClick={() => handleDelete(item.id)}
                          >
                            <FiTrash2 color="#FFF" size={17} />
                          </ActionButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </StyledTable>

            {visibleCount < filteredContratos.length && (
              <LoadMoreButton onClick={() => setVisibleCount(prev => prev + INITIAL_LIMIT)}>
                Buscar mais
              </LoadMoreButton>
            )}
          </TableContainer>
        </Container>

        {showModal && (
          <ModalContrato close={() => setShowModal(false)} conteudo={selectedContrato} />
        )}
      </div>
    </div>
  );
}