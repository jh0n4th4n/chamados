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
  const [customerSelected, setCustomerSelected] = useState(0);

  const [complemento, setComplemento] = useState('');
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [idCustomer, setIdCustomer] = useState(false);

  // Lista de assuntos relacionados a TI
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
          console.log("Nenhuma empresa encontrada");
          setCustomers([{ id: '1', nomeFantasia: 'FREELA' }]);
        } else {
          setCustomers(lista);
        }

        setLoadCustomer(false);

        if (id) {
          loadId(lista);
        }
      } catch (error) {
        console.log("Erro ao buscar os clientes", error);
        setCustomers([{ id: '1', nomeFantasia: 'FREELA' }]);
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
        setCustomerSelected(index);
        setIdCustomer(true);
      } else {
        console.log("Chamado não encontrado");
        setIdCustomer(false);
      }
    } catch (error) {
      console.log(error);
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

    if (!customers[customerSelected]) {
      toast.error("Cliente inválido. Por favor, selecione um cliente.");
      return;
    }

    const cliente = customers[customerSelected];

    try {
      if (idCustomer) {
        // Atualizar chamado
        const docRef = doc(db, "chamados", id);
        await updateDoc(docRef, {
          cliente: cliente.nomeFantasia,
          clienteId: cliente.id,
          assunto: assunto,
          complemento: complemento,
          status: status,
          userId: user.uid,
        });
        toast.info("Chamado atualizado com sucesso!");
      } else {
        // Registrar novo chamado
        await addDoc(collection(db, "chamados"), {
          created: new Date(),
          cliente: cliente.nomeFantasia,
          clienteId: cliente.id,
          assunto: assunto,
          complemento: complemento,
          status: status,
          userId: user.uid,
        });
        toast.success("Chamado registrado!");
      }

      setComplemento('');
      setCustomerSelected(0);
      navigate('/dashboard');
    } catch (error) {
      toast.error(idCustomer ? "Erro ao atualizar o chamado." : "Erro ao registrar o chamado.");
      console.log(error);
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
              <select value={customerSelected} onChange={handleChangeCustomer}>
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
              className='status'
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

            <label>Descrição do Chamado</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />

            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
