
import { useState, useEffect, useContext } from 'react'
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

import { useParams, useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'

import './new.css';

const listRef = collection(db, "customers");

export default function New() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0)

  const [complemento, setComplemento] = useState('')
  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [idCustomer, setIdCustomer] = useState(false)


  useEffect(() => {
    async function loadCustomers() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })

          if (snapshot.docs.size === 0) {
            console.log("NENHUMA EMPRESA ENCONTRADA");
            setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
            setLoadCustomer(false);
            return;
          }

          setCustomers(lista);
          setLoadCustomer(false);

          if (id) {
            loadId(lista);
          }

        })
        .catch((error) => {
          console.log("ERRRO AO BUSCAR OS CLIENTES", error)
          setLoadCustomer(false);
          setCustomers([{ id: '1', nomeFantasia: 'FREELA' }])
        })
    }

    loadCustomers();
  }, [id])


  async function loadId(lista) {
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento);


        let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomerSelected(index);
        setIdCustomer(true);

      })
      .catch((error) => {
        console.log(error);
        setIdCustomer(false);
      })
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value)
  }

  function hnadleChangeCustomer(e) {
    setCustomerSelected(e.target.value)
    console.log(customers[e.target.value].nomeFantasia);
  }

  async function handleRegister(e) {
    e.preventDefault();

    // Verificar se o cliente selecionado é válido
    if (!customers[customerSelected]) {
      toast.error("Cliente inválido. Por favor, selecione um cliente.");
      return;
    }

    const cliente = customers[customerSelected];

    if (idCustomer) {
      // Atualizando chamado
      const docRef = doc(db, "chamados", id);
      await updateDoc(docRef, {
        cliente: cliente.nomeFantasia,
        clienteId: cliente.id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso!");
          setCustomerSelected(0);
          setComplemento('');
          navigate('/dashboard');
        })
        .catch((error) => {
          toast.error("Erro ao atualizar o chamado.");
          console.log(error);
        });

      return;
    }

    // Registrar um novo chamado
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: cliente.nomeFantasia,
      clienteId: cliente.id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado registrado!");
        setComplemento('');
        setCustomerSelected(0);
        navigate('/dashboard');
      })
      .catch((error) => {
        toast.error("Erro ao registrar o chamado.");
        console.log(error);
      });
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
            {
              loadCustomer ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select value={customerSelected} onChange={hnadleChangeCustomer}>
                  {customers.map((item, index) => {
                    return (
                      <option key={index} value={index}>
                        {item.nomeFantasia}
                      </option>
                    )
                  })}
                </select>
              )
            }

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Selecione"> Selecione </option>
              <option value="Suporte">Suporte</option>
              <option value="Planilhas">Problemas em Planilhas</option>
              <option value="Sistema Operacional">Problemas no Sistema Operacional</option>
              <option value="Visita Tecnica">Visita Técnica</option>
              <option value="Computador">Problemas no Computador</option>
              <option value="Telefone">Problemas no Telefone</option>
              <option value="Esqueci minha senha">Esqueceu a Senha de Usuário</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Impressora">Problemas na Impressora</option>
              <option value="Internet">Problemas de Conexão com a Internet</option>
              <option value="Email">Problemas com E-mail</option>
              <option value="Software">Problemas com Software Específico</option>
              <option value="Hardware">Falha em Hardware</option>
              <option value="Rede">Problemas na Rede</option>
              <option value="Backup">Problemas com Backup</option>
              <option value="Segurança">Segurança da Informação</option>
              <option value="Acesso Remoto">Problemas com Acesso Remoto</option>
              <option value="Instalacao">Instalação de Software</option>
              <option value="Atualizacao">Atualização de Software</option>
              <option value="Monitor">Problemas no Monitor</option>
              <option value="Teclado">Problemas no Teclado</option>
              <option value="Mouse">Problemas no Mouse</option>
              <option value="Disco Rígido">Problemas no Disco Rígido</option>
              <option value="Alimentacao">Problemas de Alimentação (Energia)</option>
              <option value="Drivers">Problemas com Drivers</option>
              <option value="Configuração">Problemas de Configuração</option>
              <option value="Licenciamento">Licenciamento de Software</option>
              <option value="Performance">Problemas de Performance</option>
              <option value="Conexao Remota">Problemas de Conexão Remota</option>
              <option value="Perifericos">Problemas com Periféricos</option>
              <option value="Outros">Outros</option>


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
  )
}