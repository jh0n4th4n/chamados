import { FiFileText } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./contrato.module.css"

export default function Contratos() {
    return (
        <>
            <Header />
            <div className="content">
                <Title name="Contratos">
                    <FiFileText size={25} />
                </Title>
                <hr />
                <div className="container">
                    <form className="form">
                        <h2 className="form-title">Informações do Contrato</h2>
                        <input className="form-input" placeholder="Número do Contrato" />
                        <input className="form-input" placeholder="Tipo de Contrato" />
                        <textarea className="form-textarea" placeholder="Objeto do Contrato" />

                        <h2 className="form-title">Partes Envolvidas</h2>
                        <input className="form-input" placeholder="Empresa Contratada" />
                        <input className="form-input" placeholder="CNPJ" />
                        <input className="form-input" placeholder="Representante Legal" />
                        <input className="form-input" placeholder="Contato da Contratada" />
                        <input className="form-input" placeholder="Empresa Contratante" />
                        <input className="form-input" placeholder="Responsável pelo Contrato" />

                        <h2 className="form-title">Vigência e Prazos</h2>
                        <input className="form-input" type="date" placeholder="Data de Assinatura" />
                        <input className="form-input" type="date" placeholder="Data de Início" />
                        <input className="form-input" type="date" placeholder="Data de Término" />
                        <input className="form-input" placeholder="Duração Total" />
                        <select className="form-select">
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                        <input className="form-input" placeholder="Prazo para Renovação (dias)" />

                        <h2 className="form-title">Valores e Condições Financeiras</h2>
                        <input className="form-input" placeholder="Valor Total" />
                        <select className="form-select">
                            <option value="Parcelado">Parcelado</option>
                            <option value="À vista">À vista</option>
                        </select>
                        <input className="form-input" placeholder="Valor das Parcelas" />
                        <input className="form-input" placeholder="Vencimento das Parcelas" />
                        <input className="form-input" placeholder="Índice de Reajuste" />
                        <textarea className="form-textarea" placeholder="Multas e Deliberações" />

                        <h2 className="form-title">Garantias e SLA</h2>
                        <input className="form-input" placeholder="Tempo de Resposta" />
                        <input className="form-input" placeholder="Tempo de Resolução" />
                        <input className="form-input" placeholder="Cobertura do Suporte" />
                        <select className="form-select">
                            <option value="Sim">Sim</option>
                            <option value="Não">Não</option>
                        </select>
                        <input className="form-input" placeholder="Garantia sobre Serviços/Produtos (tempo)" />

                        <h2 className="form-title">Documentação e Anexos</h2>
                        <input className="form-input-file" type="file" placeholder="Arquivo do Contrato" />
                        <input className="form-input-file" type="file" placeholder="Termos Aditivos" />
                        <input className="form-input-file" type="file" placeholder="Comprovantes de Pagamento" />
                        <input className="form-input-file" type="file" placeholder="Relatórios de Fiscalização" />

                        <h2 className="form-title">Status e Histórico</h2>
                        <select className="form-select">
                            <option value="Ativo">Ativo</option>
                            <option value="Em Análise">Em Análise</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                        <textarea className="form-textarea" placeholder="Histórico de Alterações" />
                        <textarea className="form-textarea" placeholder="Observações e Notas" />

                        <button className="form-button" type="submit">Salvar Contrato</button>
                    </form>
                </div>
            </div>
        </>
    );
}
