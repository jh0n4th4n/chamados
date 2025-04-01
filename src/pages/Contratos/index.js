import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import styles from "./contrato.module.css";

export default function Contratos() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (user?.role !== "admin") return null;

  return (
    <>
      <Header />
      <div className={styles.content}>
        <Title name="Contratos">
          <FiFileText size={25} />
        </Title>
        <hr />
        <div className={styles.container}>
          <form className={styles.form}>
            <h2 className={styles.formTitle}>Informações do Contrato</h2>
            <label>Número do Contrato</label>
            <input className={styles.formInput} placeholder="Ex: CT-2024-001" />
            <label>Tipo de Contrato</label>
            <input className={styles.formInput} placeholder="Ex: Prestação de Serviço" />
            <label>Modalidade de Licitação</label>
            <input className={styles.formInput} placeholder="Ex: Dispensa, Pregão" />
            <label>Número do Processo</label>
            <input className={styles.formInput} placeholder="Ex: PA-123/2024" />
            <label>Objeto do Contrato</label>
            <textarea className={styles.formTextarea} placeholder="Descreva o objeto do contrato" />

            <h2 className={styles.formTitle}>Partes Envolvidas</h2>
            <label>Empresa Contratada</label>
            <input className={styles.formInput} placeholder="Razão social da contratada" />
            <label>CNPJ</label>
            <input className={styles.formInput} placeholder="Ex: 00.000.000/0001-00" />
            <label>Representante Legal</label>
            <input className={styles.formInput} placeholder="Nome completo" />
            <label>Contato da Contratada</label>
            <input className={styles.formInput} placeholder="Telefone ou e-mail" />
            <label>Empresa Contratante</label>
            <input className={styles.formInput} placeholder="Nome da instituição pública ou privada" />
            <label>Responsável pelo Contrato</label>
            <input className={styles.formInput} placeholder="Nome do servidor ou gestor" />

            <h2 className={styles.formTitle}>Vigência e Prazos</h2>
            <label>Data de Assinatura</label>
            <input className={styles.formInput} type="date" />
            <label>Data de Início</label>
            <input className={styles.formInput} type="date" />
            <label>Data de Término</label>
            <input className={styles.formInput} type="date" />
            <label>Duração Total (meses)</label>
            <input className={styles.formInput} placeholder="Ex: 12" />
            <label>Possui renovação automática?</label>
            <select className={styles.formSelect}>
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
            <label>Prazo para Renovação (dias)</label>
            <input className={styles.formInput} placeholder="Ex: 30" />

            <h2 className={styles.formTitle}>Valores e Condições Financeiras</h2>
            <label>Valor Total</label>
            <input className={styles.formInput} placeholder="Ex: R$ 50.000,00" />
            <label>Forma de Pagamento</label>
            <select className={styles.formSelect}>
              <option value="">Selecione</option>
              <option value="Parcelado">Parcelado</option>
              <option value="À vista">À vista</option>
            </select>
            <label>Valor das Parcelas</label>
            <input className={styles.formInput} placeholder="Ex: R$ 5.000,00" />
            <label>Vencimento das Parcelas</label>
            <input className={styles.formInput} placeholder="Ex: Todo dia 10" />
            <label>Índice de Reajuste</label>
            <input className={styles.formInput} placeholder="Ex: IPCA, IGPM" />
            <label>Multas e Penalidades</label>
            <textarea className={styles.formTextarea} placeholder="Descreva penalidades por descumprimento" />

            <h2 className={styles.formTitle}>Garantias e SLA</h2>
            <label>Tempo de Resposta (horas)</label>
            <input className={styles.formInput} placeholder="Ex: 4h úteis" />
            <label>Tempo de Resolução (horas)</label>
            <input className={styles.formInput} placeholder="Ex: 24h úteis" />
            <label>Cobertura do Suporte</label>
            <input className={styles.formInput} placeholder="Ex: Segunda a sexta, 8h às 18h" />
            <label>Possui Garantia?</label>
            <select className={styles.formSelect}>
              <option value="">Selecione</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
            <label>Prazo da Garantia (meses)</label>
            <input className={styles.formInput} placeholder="Ex: 12" />

            <h2 className={styles.formTitle}>Documentação e Anexos</h2>
            <label>Anexo 1</label>
            <input className={styles.formInputFile} type="file" />
            <label>Anexo 2</label>
            <input className={styles.formInputFile} type="file" />
            <label>Anexo 3</label>
            <input className={styles.formInputFile} type="file" />
            <label>Anexo 4</label>
            <input className={styles.formInputFile} type="file" />

            <h2 className={styles.formTitle}>Status e Histórico</h2>
            <label>Status do Contrato</label>
            <select className={styles.formSelect}>
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Pendente">Pendente</option>
              <option value="Finalizado">Finalizado</option>
            </select>
            <label>Histórico de Alterações</label>
            <textarea className={styles.formTextarea} placeholder="Descreva atualizações importantes" />
            <label>Observações e Notas</label>
            <textarea className={styles.formTextarea} placeholder="Notas internas ou esclarecimentos" />

            <button className={styles.formButton} type="submit">
              Salvar Contrato
            </button>
          </form>
        </div>
      </div>
    </>
  );
}