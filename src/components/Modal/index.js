import { FiX, FiPrinter } from 'react-icons/fi'; // Importando o ícone de impressão
import { jsPDF } from 'jspdf';
import './modal.css';
import Logo from '../../assets/testelogo.jpg'; // Certifique-se de que este caminho está correto

export default function Modal({ conteudo, close }) {
  // Função para gerar o PDF
  const handlePrint = () => {
    const doc = new jsPDF();
  
    // Criando uma nova imagem
    const logo = new Image();
    logo.src = Logo; // Use o caminho direto da imagem
  
    // Defina a função onload da imagem
    logo.onload = () => {
      // Centralizando o logo
      const logoWidth = 50; // Largura do logo
      const logoHeight = 20; // Altura do logo
      const logoX = (doc.internal.pageSize.getWidth() - logoWidth) / 2; // Centraliza o logo
  
      // Adicionando a logo ao PDF
      doc.addImage(logo, 'JPEG', logoX, 10, logoWidth, logoHeight); 
  
      // Definindo o título do relatório
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      const title = 'Relatório de Chamado';
      const titleX = (doc.internal.pageSize.getWidth() - doc.getTextWidth(title)) / 2; // Centraliza o título
      doc.text(title, titleX, 40);
  
      // Adicionando uma linha horizontal
      doc.setLineWidth(0.5);
      doc.line(10, 45, 200, 45); // Linha horizontal
  
      // Criando a tabela de informações
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      const startY = 55;
      const rowHeight = 10;
  
      // Títulos da tabela em negrito
      doc.setFont("helvetica", "bold");
      doc.text("Unidade:", 10, startY);
      doc.text("Cliente:", 10, startY + rowHeight);
      doc.text("Usuário:", 10, startY + rowHeight * 2);
      doc.text("Assunto:", 10, startY + rowHeight * 3);
      doc.text("Cadastrado em:", 10, startY + rowHeight * 4);
      doc.text("Status:", 10, startY + rowHeight * 5);
      if (conteudo.complemento) {
        doc.text("Complemento:", 10, startY + rowHeight * 6);
      }
  
      // Voltando para fonte normal
      doc.setFont("helvetica", "normal");
  
      // Adicionando os dados
      doc.text(`Hospital Regional Jesus Nazareno - FUSAM`, 60, startY);
      doc.text(`${conteudo.cliente}`, 60, startY + rowHeight);
      doc.text(`${conteudo.usuario}`, 60, startY + rowHeight * 2);
      doc.text(`${conteudo.assunto}`, 60, startY + rowHeight * 3);
      doc.text(`${conteudo.createdFormat}`, 60, startY + rowHeight * 4);
      doc.text(`${conteudo.status}`, 60, startY + rowHeight * 5);
      if (conteudo.complemento) {
        doc.text(`${conteudo.complemento}`, 60, startY + rowHeight * 6);
      }
  
      // Adicionando a data e horário no rodapé
      const currentDate = new Date();
      const dateString = currentDate.toLocaleString(); // Formata a data e hora
      const pageCount = doc.internal.getNumberOfPages();
      
      // Posição do rodapé
      const footerY = doc.internal.pageSize.height - 10;
  
      doc.setFontSize(10);
      doc.text(`Relatorio impresso em : ${dateString}`, 10, footerY); // Alinha à esquerda
      doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageCount}`, doc.internal.pageSize.getWidth() - 40, footerY, { align: 'right' }); // Alinha à direita
  
      // Salvar o PDF
      doc.save('chamado.pdf');
    };
  
    // Caso a imagem não consiga ser carregada, podemos exibir uma mensagem de erro
    logo.onerror = () => {
      console.error('Erro ao carregar a logo.');
    };
  };
  
  
  
  
  
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={25} color="#FFF" />
          Voltar
        </button>

        <button className="print" onClick={handlePrint}>
          <FiPrinter size={25} color="#FFF" />
          Imprimir
        </button>

        <main>
          <h2>Detalhes do chamado</h2>

            <div className="row">
              <span>
                Unidade: <i> Hospital Regional Jesus Nazareno - FUSAM</i>
              </span>
            </div>

            <div className="row">
              <span>
                Cliente: <i>{conteudo.cliente}</i>
              </span>
            </div>

            {/* <div className="row">
              <span>
                Usuário: <i>{conteudo.nome || 'Em Desenvolvimento' }</i>
              </span>
            </div> */}

            <div className="row">
              <span>
                Assunto: <i>{conteudo.assunto}</i>
              </span>
              </div>
              
              <div className="row">
              <span>
                Cadastrado em: <i>{conteudo.createdFormat}</i>
              </span>
            </div>

            <div className="row">
              <span>
                Status:
                <i className="status-badge" style={{ color: "#FFF", backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                  {conteudo.status}
                </i>
              </span>
          </div>

          {conteudo.complemento && (
            <>
              <h3>Complemento</h3>
              <p>{conteudo.complemento}</p>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
