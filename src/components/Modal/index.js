import { FiX, FiPrinter } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './modal.css';
import Logo from '../../assets/Logo HRJN.png';

export default function Modal({ conteudo, close }) {
  const finalizadoEm = conteudo.finalizadoEm?.toDate?.() || conteudo.finalizadoEm || null;
  const criadoEm = conteudo.created?.toDate?.() || conteudo.created || new Date();

  const finalizadoFormat = finalizadoEm
    ? new Date(finalizadoEm).toLocaleString()
    : '—';

  const duracao = finalizadoEm
    ? formatDistanceStrict(criadoEm, finalizadoEm, { locale: ptBR })
    : 'Em andamento';

  const handlePrint = () => {
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = Logo;

    logo.onload = () => {
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const logoWidth = 50;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(logo, 'JPEG', logoX, 10, logoWidth, 20);

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text('Relatório de Chamado', pageWidth / 2, 40, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(10, 50, pageWidth - 10, 50);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const startY = 60;
      const rowHeight = 10;

      const fields = [
        ["Unidade:", "Hospital Regional Jesus Nazareno - FUSAM"],
        ["Cliente:", conteudo.cliente || 'N/A'],
        ["Usuário:", conteudo.usuario || 'N/A'],
        ["Assunto:", conteudo.assunto || 'N/A'],
        ["Cadastrado em:", conteudo.createdFormat || 'N/A'],
        ["Encerrado em:", finalizadoFormat],
        ["Duração do chamado:", duracao],
        ["Status:", conteudo.status || 'N/A'],
      ];

      fields.forEach(([label, value], index) => {
        const y = startY + index * rowHeight;
        doc.setFont("helvetica", "bold");
        doc.text(label, 10, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, 60, y);
      });

      if (conteudo.complemento) {
        doc.setFont("helvetica", "bold");
        const complementoLabelY = startY + fields.length * rowHeight;
        doc.text("Complemento:", 10, complementoLabelY);
        doc.setFont("helvetica", "normal");
        const complementoY = complementoLabelY + rowHeight;
        const complementoText = doc.splitTextToSize(conteudo.complemento, pageWidth - 20);
        doc.text(complementoText, 10, complementoY);
      }

      const footerY = pageHeight - 10;
      doc.setFontSize(10);
      const currentDate = new Date().toLocaleString();
      doc.text(`Relatório impresso em: ${currentDate}`, 10, footerY);
      doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 20, footerY, { align: 'right' });

      doc.save('O.S (TI) HRJN.pdf');
    };

    logo.onerror = () => {
      console.error('Erro ao carregar a logo.');
    };
  };

  return (
    <div className="modal">
      <div className="container">
        <div className="modal-buttons-left">
          <button className="close" onClick={close}>
            <FiX size={20} color="#FFF" />
            Fechar
          </button>
          <button className="print" onClick={handlePrint}>
            <FiPrinter size={20} color="#FFF" />
            Imprimir
          </button>
        </div>

        <main>
          <h2>Detalhes do chamado</h2>
          <div className="row"><span>Unidade: <i>Hospital Regional Jesus Nazareno - FUSAM</i></span></div>
          <div className="row"><span>Cliente: <i>{conteudo.cliente}</i></span></div>
          <div className="row"><span>Usuário: <i>{conteudo.usuario || 'Usuário não informado'}</i></span></div>
          <div className="row"><span>Assunto: <i>{conteudo.assunto}</i></span></div>
          <div className="row"><span>Cadastrado em: <i>{conteudo.createdFormat}</i></span></div>
          <div className="row"><span>Encerrado em: <i>{finalizadoFormat}</i></span></div>
          <div className="row"><span>Duração do chamado: <i>{duracao}</i></span></div>
          <div className="row">
            <span>Status:
              <i className="status-badge" style={{ backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999' }}>
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
