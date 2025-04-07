import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiFileText } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import {
  PageContent,
  FormContainer,
  SectionTitle,
  StyledForm,
  StyledLabel,
  StyledInput,
  StyledSelect,
  StyledTextarea,
  FileInput,
  SubmitButton
} from "./styled";

export default function Contratos() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "contratos"), {
        ...data,
        cliente: data.empresaContratada,
        created: serverTimestamp(),
      });

      reset();
      navigate("/contratos");
    } catch (error) {
      console.error("Erro ao salvar contrato:", error);
      alert("Erro ao salvar contrato.");
    }
  };

  if (user?.role !== "admin") return null;

  return (
    <>
      <Header />
      <div className="content">
        <Title name="Contratos">
          <FiFileText size={25} />
        </Title>
        <PageContent>
          <FormContainer>
            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <SectionTitle>Informações do Contrato</SectionTitle>
              <StyledLabel>Número do Contrato</StyledLabel>
              <StyledInput placeholder="Ex: CT-2024-001" {...register("numeroContrato", { required: true })} />

              <StyledLabel>Tipo de Contrato</StyledLabel>
              <StyledInput placeholder="Ex: Prestação de Serviço" {...register("tipoContrato", { required: true })} />

              <StyledLabel>Modalidade de Licitação</StyledLabel>
              <StyledInput placeholder="Ex: Dispensa, Pregão" {...register("modalidadeLicitacao")} />

              <StyledLabel>Número do Processo</StyledLabel>
              <StyledInput placeholder="Ex: PA-123/2024" {...register("numeroProcesso")} />

              <StyledLabel>Objeto do Contrato</StyledLabel>
              <StyledTextarea placeholder="Descreva o objeto do contrato" {...register("objetoContrato", { required: true })} />

              <SectionTitle>Partes Envolvidas</SectionTitle>
              <StyledLabel>Empresa Contratada</StyledLabel>
              <StyledInput placeholder="Razão social da contratada" {...register("empresaContratada", { required: true })} />

              <StyledLabel>CNPJ</StyledLabel>
              <StyledInput placeholder="Ex: 00.000.000/0001-00" {...register("cnpj", { pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/ })} />

              <StyledLabel>Representante Legal</StyledLabel>
              <StyledInput placeholder="Nome completo" {...register("representanteLegal")} />

              <StyledLabel>Contato da Contratada</StyledLabel>
              <StyledInput placeholder="Telefone ou e-mail" {...register("contatoContratada")} />

              <StyledLabel>Empresa Contratante</StyledLabel>
              <StyledInput placeholder="Nome da instituição pública ou privada" {...register("empresaContratante")} />

              <StyledLabel>Responsável pelo Contrato</StyledLabel>
              <StyledInput placeholder="Nome do servidor ou gestor" {...register("responsavelContrato")} />

              <SectionTitle>Vigência e Prazos</SectionTitle>
              <StyledLabel>Data de Assinatura</StyledLabel>
              <StyledInput type="date" {...register("dataAssinatura")} />

              <StyledLabel>Data de Início</StyledLabel>
              <StyledInput type="date" {...register("dataInicio", { required: true })} />

              <StyledLabel>Data de Término</StyledLabel>
              <StyledInput type="date" {...register("dataFim", { required: true })} />

              <StyledLabel>Duração Total (meses)</StyledLabel>
              <StyledInput placeholder="Ex: 12" type="number" {...register("duracao", { min: 1 })} />

              <StyledLabel>Possui renovação automática?</StyledLabel>
              <StyledSelect {...register("renovacaoAutomatica")}>
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </StyledSelect>

              <StyledLabel>Prazo para Renovação (dias)</StyledLabel>
              <StyledInput placeholder="Ex: 30" type="number" {...register("prazoRenovacao")} />

              <SectionTitle>Valores e Condições Financeiras</SectionTitle>
              <StyledLabel>Valor Total</StyledLabel>
              <StyledInput placeholder="Ex: R$ 50.000,00" {...register("valorTotal", { required: true })} />

              <StyledLabel>Forma de Pagamento</StyledLabel>
              <StyledSelect {...register("formaPagamento")}>
                <option value="">Selecione</option>
                <option value="Parcelado">Parcelado</option>
                <option value="À vista">À vista</option>
              </StyledSelect>

              <StyledLabel>Valor das Parcelas</StyledLabel>
              <StyledInput placeholder="Ex: R$ 5.000,00" {...register("valorParcelas")} />

              <StyledLabel>Vencimento das Parcelas</StyledLabel>
              <StyledInput placeholder="Ex: Todo dia 10" {...register("vencimentoParcelas")} />

              <StyledLabel>Índice de Reajuste</StyledLabel>
              <StyledInput placeholder="Ex: IPCA, IGPM" {...register("indiceReajuste")} />

              <StyledLabel>Multas e Penalidades</StyledLabel>
              <StyledTextarea placeholder="Descreva penalidades por descumprimento" {...register("multasPenalidades")} />

              <SectionTitle>Garantias e SLA</SectionTitle>
              <StyledLabel>Tempo de Resposta (horas)</StyledLabel>
              <StyledInput placeholder="Ex: 4h úteis" {...register("tempoResposta")} />

              <StyledLabel>Tempo de Resolução (horas)</StyledLabel>
              <StyledInput placeholder="Ex: 24h úteis" {...register("tempoResolucao")} />

              <StyledLabel>Cobertura do Suporte</StyledLabel>
              <StyledInput placeholder="Ex: Segunda a sexta, 8h às 18h" {...register("suporte")} />

              <StyledLabel>Possui Garantia?</StyledLabel>
              <StyledSelect {...register("possuiGarantia")}>
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </StyledSelect>

              <StyledLabel>Prazo da Garantia (meses)</StyledLabel>
              <StyledInput placeholder="Ex: 12" type="number" {...register("prazoGarantia")} />

              <SectionTitle>Status e Histórico</SectionTitle>
              <StyledLabel>Status do Contrato</StyledLabel>
              <StyledSelect {...register("status")}>
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Pendente">Pendente</option>
                <option value="Finalizado">Finalizado</option>
              </StyledSelect>

              <StyledLabel>Histórico de Alterações</StyledLabel>
              <StyledTextarea placeholder="Descreva atualizações importantes" {...register("historico")} />

              <StyledLabel>Observações e Notas</StyledLabel>
              <StyledTextarea placeholder="Notas internas ou esclarecimentos" {...register("observacoes")} />

              <SubmitButton type="submit">Salvar Contrato</SubmitButton>
            </StyledForm>
          </FormContainer>
        </PageContent>
      </div>
    </>
  );
}