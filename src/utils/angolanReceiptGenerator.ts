import jsPDF from 'jspdf';

interface CustomerData {
  name: string;
  bi: string;
  email: string;
  phone: string;
  address: string;
}

interface ReservationData {
  type: string;
  name: string;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  location: string;
}

interface CostData {
  subtotal: number;
  taxes: number;
  fees: number;
  discounts: number;
  total: number;
}

interface ReceiptData {
  receiptNumber: string;
  customer: CustomerData;
  reservation: ReservationData;
  costs: CostData;
  paymentMethod: string;
  paymentDate: string;
  status: 'paid' | 'pending' | 'cancelled';
}

export const generateAngolanReceipt = (data: ReceiptData): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Cores
  const primaryColor = '#1F2937';
  const accentColor = '#059669';
  const grayColor = '#6B7280';
  const lightGrayColor = '#F3F4F6';

  // Configurações de fonte
  doc.setFont('helvetica');

  // Header da empresa
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  // Logo placeholder (círculo)
  doc.setFillColor(accentColor);
  doc.circle(25, 20, 8, 'F');

  // Nome da empresa
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('VOYAGEANGOLA', 45, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Resort & Tourism Services', 45, 26);
  doc.text('Luanda, Angola | +244 222 000 000', 45, 32);

  // Título do recibo
  doc.setTextColor(primaryColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('RECIBO DE PAGAMENTO', 20, 55);

  // Número do recibo e data
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Recibo Nº: ${data.receiptNumber}`, 20, 65);
  doc.text(`Data: ${new Date(data.paymentDate).toLocaleDateString('pt-BR')}`, 20, 72);

  // Status
  const statusColor = data.status === 'paid' ? accentColor : '#F59E0B';
  doc.setFillColor(statusColor);
  doc.roundedRect(150, 48, 40, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.status === 'paid' ? 'PAGO' : 'PENDENTE', 165, 55);

  // Linha separadora
  doc.setDrawColor(grayColor);
  doc.setLineWidth(0.5);
  doc.line(20, 80, 190, 80);

  // Dados do cliente
  doc.setTextColor(primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', 20, 90);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${data.customer.name}`, 20, 100);
  doc.text(`BI: ${data.customer.bi}`, 20, 107);
  doc.text(`Email: ${data.customer.email}`, 20, 114);
  doc.text(`Telefone: ${data.customer.phone}`, 20, 121);
  doc.text(`Endereço: ${data.customer.address}`, 20, 128);

  // Dados da reserva
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHES DA RESERVA', 20, 145);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tipo: ${data.reservation.type.toUpperCase()}`, 20, 155);
  doc.text(`Serviço: ${data.reservation.name}`, 20, 162);
  doc.text(`Local: ${data.reservation.location}`, 20, 169);
  
  if (data.reservation.checkIn) {
    doc.text(`Check-in: ${new Date(data.reservation.checkIn).toLocaleDateString('pt-BR')}`, 20, 176);
  }
  if (data.reservation.checkOut) {
    doc.text(`Check-out: ${new Date(data.reservation.checkOut).toLocaleDateString('pt-BR')}`, 20, 183);
  }
  
  doc.text(`Hóspedes: ${data.reservation.guests}`, 20, 190);

  // Tabela de custos
  const tableY = 205;
  doc.setFillColor(lightGrayColor);
  doc.rect(20, tableY, 170, 8, 'F');

  doc.setTextColor(primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DISCRIMINAÇÃO DE VALORES', 25, tableY + 5);

  // Linhas da tabela
  const rowHeight = 8;
  let currentY = tableY + 12;

  const costs = [
    { label: 'Subtotal', value: data.costs.subtotal },
    { label: 'Impostos (14%)', value: data.costs.taxes },
    { label: 'Taxas de serviço', value: data.costs.fees },
    { label: 'Descontos', value: -data.costs.discounts }
  ];

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  costs.forEach((cost) => {
    doc.text(cost.label, 25, currentY);
    doc.text(`AOA ${cost.value.toLocaleString('pt-AO')}`, 150, currentY, { align: 'right' });
    currentY += rowHeight;
  });

  // Total
  doc.setFillColor(accentColor);
  doc.rect(20, currentY, 170, 10, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL GERAL', 25, currentY + 6);
  doc.text(`AOA ${data.costs.total.toLocaleString('pt-AO')}`, 180, currentY + 6, { align: 'right' });

  // Método de pagamento
  currentY += 20;
  doc.setTextColor(primaryColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Método de Pagamento:', 20, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(data.paymentMethod, 65, currentY);

  // QR Code placeholder (seria implementado com uma biblioteca de QR Code)
  currentY += 15;
  doc.setDrawColor(grayColor);
  doc.rect(150, currentY, 30, 30);
  doc.setFontSize(8);
  doc.text('QR Code', 158, currentY + 17);
  doc.text('Verificação', 155, currentY + 22);

  // Informações fiscais
  doc.setFontSize(9);
  doc.setTextColor(grayColor);
  doc.text('Este documento serve como recibo de pagamento.', 20, currentY + 10);
  doc.text('NIF: 5417000000 | Regime Geral do IVA', 20, currentY + 15);
  doc.text('Documento processado eletronicamente', 20, currentY + 20);

  // Rodapé
  const footerY = 280;
  doc.setDrawColor(grayColor);
  doc.line(20, footerY, 190, footerY);
  
  doc.setFontSize(8);
  doc.text('VOYAGEANGOLA - Resort & Tourism Services', 20, footerY + 5);
  doc.text('Email: info@voyageangola.ao | Website: www.voyageangola.ao', 20, footerY + 10);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 140, footerY + 5);

  return doc;
};

export const downloadReceipt = (data: ReceiptData, filename?: string) => {
  const doc = generateAngolanReceipt(data);
  const defaultFilename = `recibo-${data.receiptNumber}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename || defaultFilename);
};

export const getReceiptBlob = (data: ReceiptData): Blob => {
  const doc = generateAngolanReceipt(data);
  return doc.output('blob');
};