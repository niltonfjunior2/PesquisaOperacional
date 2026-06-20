import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Captura um elemento HTML e gera um PDF de alta fidelidade (client-side).
 * Útil para relatórios acadêmicos onde as tabelas e gráficos (Tailwind/Recharts) 
 * devem manter suas exatas proporções.
 * 
 * @param element Elemento HTML a ser exportado
 * @param filename Nome do arquivo de saída
 */
export async function generatePdfFromElement(element: HTMLElement, filename: string = "relatorio-po.pdf"): Promise<void> {
  try {
    // Gera o canvas com scale 2x para evitar serrilhados (retina display like)
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 = 210 x 297 mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calcula escala mantendo aspect ratio
    // Margem horizontal de 10mm de cada lado (20mm no total)
    const imgWidth = pdfWidth - 20; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10; // Margem no topo (10mm)

    // Adiciona a primeira página
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20); // subtrai o que já coube na primeira página

    // Lógica para quebra de múltiplas páginas caso o conteúdo seja longo (ex: grafos imensos ou quadros simplex)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10; // 10mm é a margem de topo
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
    }

    pdf.save(filename);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error("Não foi possível gerar o relatório PDF.");
  }
}
