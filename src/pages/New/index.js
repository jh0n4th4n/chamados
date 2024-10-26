import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
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
  const [customerSelected, setCustomerSelected] = useState(null); // Alterado para null
  const [complemento, setComplemento] = useState('');
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [idCustomer, setIdCustomer] = useState(false);

  const assuntosTI = [
    'Suporte Técnico',
    'Problemas de Rede',
    'Problemas de Hardware',
    'Problemas de Software',
    'Manutenção de Equipamentos',
    'Configuração de Sistemas',
    'Treinamento de Usuários',
    'Segurança da Informação',
    'Backup de Dados',
    'Atualização de Software',
  ];

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
        console.log("Erro ao buscar os clientes", error);
        toast.error("Erro ao buscar os clientes");
        setLoadCustomer(false);
      }
    }

    loadCustomers();
  }, [id]);

  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);
    try {
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = lista.findIndex((item) => item.id === snapshot.data().clienteId);
        setCustomerSelected(index !== -1 ? index : null); // Validação de índice
        setIdCustomer(true);
      } else {
        console.log("Chamado não encontrado");
        toast.error("Chamado não encontrado");
        setIdCustomer(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao carregar chamado");
      setIdCustomer(false);
    }
  }

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
      console.log(customers[selectedIndex].nomeFantasia);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (customerSelected === null || !customers[customerSelected]) {
      toast.error("Cliente inválido. Por favor, selecione um cliente.");
      return;
    }

    const cliente = customers[customerSelected];

    try {
      const docRef = idCustomer ? doc(db, "chamados", id) : null;
      const data = {
        cliente: cliente.nomeFantasia,
        clienteId: cliente.id,
        assunto,
        complemento,
        status,
        userId: user.uid,
      };

      if (idCustomer) {
        await updateDoc(docRef, data);
        toast.info("Chamado atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "chamados"), {
          ...data,
          created: new Date(),
        });
        toast.success("Chamado registrado!");
      }

      setComplemento('');
      setCustomerSelected(null); // Resetado para null
      navigate('/dashboard');
    } catch (error) {
      toast.error(idCustomer ? "Erro ao atualizar o chamado." : "Erro ao registrar o chamado.");
      console.error(error);
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
