import { useState, useEffect, useContext, useCallback } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import {
  collection, getDocs, getDoc, doc, addDoc, updateDoc
} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './new.css';

const listRef = collection(db, "customers");

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(null);
  const [complemento, setComplemento] = useState('');
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [idCustomer, setIdCustomer] = useState(false);

  const assuntosTI = [
    "Atualização de Software", "Conflito entre Aplicativos", "Erro de Sistema", "Falha ao Atualizar Software",
    "Falha na Inicialização do Sistema", "Instalar Software", "Lentidão no Sistema", "Problema com Aplicativos Web",
    "Problema com Licenciamento de Software", "Problema com Sincronização de Dados", "Problema de Software",
    "Problema de Sistema Operacional", "Manutenção de Equipamentos", "Problema com Dispositivos USB",
    "Problema com Drivers", "Problema com Monitor", "Problema com Periféricos", "Problema de Hardware",
    "Falha ao Acessar Servidor", "Falha na Conexão VPN", "Falha na Rede Wi-Fi", "Problema com Compartilhamento de Arquivos",
    "Problema com Conectividade Bluetooth", "Problema com Impressão em Rede", "Problema de Internet", "Problema de Rede",
    "Problema em Servidores", "Queda de Conexão com Banco de Dados", "Instalação e Gestão de Antivírus",
    "Problema com Firewall", "Problema de Segurança", "Backup de Dados", "Configuração de Sistemas",
    "Problema com Acesso Remoto", "Problema com Armazenamento em Nuvem", "Problema com Backup Automático",
    "Suporte Técnico", "Suporte em Planilhas", "Suporte em Sistema Operacional", "Treinamento de Usuários",
    "Problema de Telecomunicação", "Problema de Telefonia", "Problema de Impressão"
  ];

  const loadId = useCallback(async (lista) => {
    const docRef = doc(db, "chamados", id);
    try {
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        const index = lista.findIndex((item) => item.id === snapshot.data().clienteId);
        setCustomerSelected(index !== -1 ? index : null);
        setIdCustomer(true);
      } else {
        toast.error("Chamado não encontrado");
        setIdCustomer(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar chamado");
      setIdCustomer(false);
    }
  }, [id]);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const snapshot = await getDocs(listRef);
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeFantasia: doc.data().nomeFantasia,
          });
        });

        if (snapshot.empty) {
          toast.warn("Nenhuma empresa encontrada");
          setCustomers([]);
        } else {
          setCustomers(lista);
        }

        setLoadCustomer(false);

        if (id) {
          loadId(lista);
        }
      } catch (error) {
        console.error("Erro ao buscar os clientes", error);
        toast.error("Erro ao buscar os clientes");
        setLoadCustomer(false);
      }
    }

    loadCustomers();
  }, [id, loadId]);

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleChangeCustomer(e) {
    const selectedIndex = e.target.value;
    if (customers[selectedIndex]) {
      setCustomerSelected(selectedIndex);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (customerSelected === null || !customers[customerSelected]) {
      toast.error("Selecione um cliente válido.");
      return;
    }

    const cliente = customers[customerSelected];

    try {
      const baseData = {
        cliente: cliente.nomeFantasia,
        clienteId: cliente.id,
        assunto,
        complemento,
        status,
        userId: user.uid,
        setor: user?.setor || 'Setor não informado',
      };

      if (idCustomer) {
        const chamadoRef = doc(db, "chamados", id);
        const chamadoSnap = await getDoc(chamadoRef);

        if (!chamadoSnap.exists()) {
          toast.error("Chamado não encontrado para edição.");
          return;
        }

        const chamadoExistente = chamadoSnap.data();

        await updateDoc(chamadoRef, {
          ...baseData,
          usuario: chamadoExistente.usuario || 'Usuário original não identificado',
          created: chamadoExistente.created,
        });

        toast.success("Chamado atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "chamados"), {
          ...baseData,
          usuario: user?.displayName || user?.nome || user?.email || 'Usuário não identificado',
          created: new Date(),
        });

        toast.success("Chamado registrado com sucesso!");
      }

      setComplemento('');
      setCustomerSelected(null);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(idCustomer ? "Erro ao atualizar o chamado." : "Erro ao registrar o chamado.");
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Setor Solicitante</label>
            {loadCustomer ? (
              <input type="text" disabled value="Carregando..." />
            ) : (
              <select value={customerSelected ?? ''} onChange={handleChangeCustomer}>
                <option value="" disabled>Selecione um cliente</option>
                {customers.map((item, index) => (
                  <option key={index} value={index}>
                    {item.nomeFantasia}
                  </option>
                ))}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              {assuntosTI.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {user.role === 'admin' && (
              <>
                <label>Status</label>
                <div className="status">
                  <input
                    type="radio"
                    name="radio"
                    value="Aberto"
                    onChange={handleOptionChange}
                    checked={status === 'Aberto'}
                  />
                  <span>Em aberto</span>

                  <input
                    type="radio"
                    name="radio"
                    value="Progresso"
                    onChange={handleOptionChange}
                    checked={status === 'Progresso'}
                  />
                  <span>Progresso</span>

                  <input
                    type="radio"
                    name="radio"
                    value="Atendido"
                    onChange={handleOptionChange}
                    checked={status === 'Atendido'}
                  />
                  <span>Atendido</span>
                </div>
              </>
            )}

            <label>Descrição do Chamado</label>
            <textarea
              placeholder="Descreva seu problema."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              required
            />

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
