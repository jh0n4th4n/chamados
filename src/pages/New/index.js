import { useState, useEffect, useContext, useCallback } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import {
  doc, getDoc, addDoc, updateDoc, collection, arrayUnion
} from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './new.css';

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [complemento, setComplemento] = useState('');
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [idCustomer, setIdCustomer] = useState(false);
  const [setorSelecionado, setSetorSelecionado] = useState(user?.setor || '');

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

  const setoresDisponiveis = ["Ala A", "Ala B", "Almoxarifado", "Ambulatorio", "Arquivo", "Banco de Leite", "Berçario Externo",
    "Berçario Interno", "Bloco Cirurgico", "CCIH", "CME", "Canguru", "Comissão de Etica", "Compras",
    "Contas Medicas", "Coordenação de Enfermagem", "Copa", "Corredores", "Cozinha", "Direção Geral",
    "Direção Recepção", "Engenharia Clinica", "Epidemiologia", "Farmácia", "Financeiro", "Jurídico",
    "Laboratorio", "Lactario", "Lavanderia", "Manutenção", "Motoristas", "NEP", "Nucleo de Regulação Interna",
    "Nutrição", "Núcleo de Segurança do Paciente", "Planejamento", "Pré-Parto", "Psicologia",
    "Recepção Central", "Recepção de Emergência", "Recursos Humanos", "Sala de Arquivos", "Sala de Pesquisa",
    "Sala de Vacina", "Serviço Social", "Soluções", "TI", "Teste da Orelhinha", "Triagem", "Ultrassonografia"];

  const loadChamado = useCallback(async () => {
    if (!id) return;
    const docRef = doc(db, "chamados", id);
    try {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAssunto(data.assunto);
        setStatus(data.status);
        setComplemento(data.complemento);
        setSetorSelecionado(data.setor || user?.setor || '');
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
  }, [id, user?.setor]);

  useEffect(() => {
    loadChamado();
  }, [loadChamado]);

  async function handleRegister(e) {
    e.preventDefault();
    const cliente = { nomeFantasia: setorSelecionado, id: setorSelecionado };

    if (!cliente.nomeFantasia) {
      toast.error("Setor do usuário não identificado.");
      return;
    }

    try {
      const baseData = {
        cliente: cliente.nomeFantasia,
        clienteId: cliente.id,
        assunto,
        complemento,
        status,
        userId: user.uid,
      };

      if (idCustomer) {
        const chamadoRef = doc(db, "chamados", id);
        const chamadoSnap = await getDoc(chamadoRef);

        if (!chamadoSnap.exists()) {
          toast.error("Chamado não encontrado para edição.");
          return;
        }

        const chamadoExistente = chamadoSnap.data();
        const finalizadoEm = status === 'Atendido' ? new Date() : chamadoExistente.finalizadoEm || null;

        const historicoStatus = chamadoExistente.historicoStatus || [];
        const ultimoStatus = historicoStatus[historicoStatus.length - 1]?.status;

        const updateData = {
          ...baseData,
          usuario: chamadoExistente.usuario || user?.nome || 'Usuário original não identificado',
          setor: chamadoExistente.setor || setorSelecionado,
          created: chamadoExistente.created,
          finalizadoEm,
        };

        if (status !== ultimoStatus) {
          updateData.historicoStatus = arrayUnion({
            status,
            data: new Date(),
            usuario: user?.nome || user?.displayName || user?.email || 'Usuário desconhecido'
          });
        }

        await updateDoc(chamadoRef, updateData);
        toast.success("Chamado atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "chamados"), {
          ...baseData,
          usuario: user?.displayName || user?.nome || user?.email || 'Usuário não identificado',
          setor: setorSelecionado,
          created: new Date(),
          historicoStatus: [
            {
              status,
              data: new Date(),
              usuario: user?.nome || user?.displayName || user?.email || 'Usuário desconhecido'
            }
          ]
        });
        toast.success("Chamado registrado com sucesso!");
      }

      setComplemento('');
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
            {user.role === 'admin' ? (
              <select value={setorSelecionado} onChange={(e) => setSetorSelecionado(e.target.value)} required>
                {setoresDisponiveis.map((setor, index) => (
                  <option key={index} value={setor}>{setor}</option>
                ))}
              </select>
            ) : (
              <input type="text" disabled value={setorSelecionado || 'Setor não identificado'} />
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={(e) => setAssunto(e.target.value)}>
              {assuntosTI.map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>

            {user.role === 'admin' && (
              <>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Aberto">Aberto</option>
                  <option value="Progresso">Em Progresso</option>
                  <option value="Atendido">Atendido</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
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
