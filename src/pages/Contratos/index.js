import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiFileText } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { AuthContext } from "../../contexts/auth";
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

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

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
            <StyledForm>
              <SectionTitle>Informações do Contrato</SectionTitle>
              <StyledLabel>Número do Contrato</StyledLabel>
              <StyledInput placeholder="Ex: CT-2024-001" />
              <StyledLabel>Tipo de Contrato</StyledLabel>
              <StyledInput placeholder="Ex: Prestação de Serviço" />
              <StyledLabel>Modalidade de Licitação</StyledLabel>
              <StyledInput placeholder="Ex: Dispensa, Pregão" />
              <StyledLabel>Número do Processo</StyledLabel>
              <StyledInput placeholder="Ex: PA-123/2024" />
              <StyledLabel>Objeto do Contrato</StyledLabel>
              <StyledTextarea placeholder="Descreva o objeto do contrato" />

              <SectionTitle>Partes Envolvidas</SectionTitle>
              <StyledLabel>Empresa Contratada</StyledLabel>
              <StyledInput placeholder="Razão social da contratada" />
              <StyledLabel>CNPJ</StyledLabel>
              <StyledInput placeholder="Ex: 00.000.000/0001-00" />
              <StyledLabel>Representante Legal</StyledLabel>
              <StyledInput placeholder="Nome completo" />
              <StyledLabel>Contato da Contratada</StyledLabel>
              <StyledInput placeholder="Telefone ou e-mail" />
              <StyledLabel>Empresa Contratante</StyledLabel>
              <StyledInput placeholder="Nome da instituição pública ou privada" />
              <StyledLabel>Responsável pelo Contrato</StyledLabel>
              <StyledInput placeholder="Nome do servidor ou gestor" />

              <SectionTitle>Vigência e Prazos</SectionTitle>
              <StyledLabel>Data de Assinatura</StyledLabel>
              <StyledInput type="date" />
              <StyledLabel>Data de Início</StyledLabel>
              <StyledInput type="date" />
              <StyledLabel>Data de Término</StyledLabel>
              <StyledInput type="date" />
              <StyledLabel>Duração Total (meses)</StyledLabel>
              <StyledInput placeholder="Ex: 12" />
              <StyledLabel>Possui renovação automática?</StyledLabel>
              <StyledSelect>
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </StyledSelect>
              <StyledLabel>Prazo para Renovação (dias)</StyledLabel>
              <StyledInput placeholder="Ex: 30" />

              <SectionTitle>Valores e Condições Financeiras</SectionTitle>
              <StyledLabel>Valor Total</StyledLabel>
              <StyledInput placeholder="Ex: R$ 50.000,00" />
              <StyledLabel>Forma de Pagamento</StyledLabel>
              <StyledSelect>
                <option value="">Selecione</option>
                <option value="Parcelado">Parcelado</option>
                <option value="À vista">À vista</option>
              </StyledSelect>
              <StyledLabel>Valor das Parcelas</StyledLabel>
              <StyledInput placeholder="Ex: R$ 5.000,00" />
              <StyledLabel>Vencimento das Parcelas</StyledLabel>
              <StyledInput placeholder="Ex: Todo dia 10" />
              <StyledLabel>Índice de Reajuste</StyledLabel>
              <StyledInput placeholder="Ex: IPCA, IGPM" />
              <StyledLabel>Multas e Penalidades</StyledLabel>
              <StyledTextarea placeholder="Descreva penalidades por descumprimento" />

              <SectionTitle>Garantias e SLA</SectionTitle>
              <StyledLabel>Tempo de Resposta (horas)</StyledLabel>
              <StyledInput placeholder="Ex: 4h úteis" />
              <StyledLabel>Tempo de Resolução (horas)</StyledLabel>
              <StyledInput placeholder="Ex: 24h úteis" />
              <StyledLabel>Cobertura do Suporte</StyledLabel>
              <StyledInput placeholder="Ex: Segunda a sexta, 8h às 18h" />
              <StyledLabel>Possui Garantia?</StyledLabel>
              <StyledSelect>
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </StyledSelect>
              <StyledLabel>Prazo da Garantia (meses)</StyledLabel>
              <StyledInput placeholder="Ex: 12" />

              <SectionTitle>Documentação e Anexos</SectionTitle>
              <StyledLabel>Anexo 1</StyledLabel>
              <FileInput type="file" />
              <StyledLabel>Anexo 2</StyledLabel>
              <FileInput type="file" />
              <StyledLabel>Anexo 3</StyledLabel>
              <FileInput type="file" />
              <StyledLabel>Anexo 4</StyledLabel>
              <FileInput type="file" />

              <SectionTitle>Status e Histórico</SectionTitle>
              <StyledLabel>Status do Contrato</StyledLabel>
              <StyledSelect>
                <option value="">Selecione</option>
                <option value="Ativo">Ativo</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Pendente">Pendente</option>
                <option value="Finalizado">Finalizado</option>
              </StyledSelect>
              <StyledLabel>Histórico de Alterações</StyledLabel>
              <StyledTextarea placeholder="Descreva atualizações importantes" />
              <StyledLabel>Observações e Notas</StyledLabel>
              <StyledTextarea placeholder="Notas internas ou esclarecimentos" />

              <SubmitButton type="submit">Salvar Contrato</SubmitButton>
            </StyledForm>
          </FormContainer>
        </PageContent>
      </div>
    </>
  );
}