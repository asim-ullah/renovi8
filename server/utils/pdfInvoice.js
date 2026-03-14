const PDFDocument = require('pdfkit');

const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=renovi8-invoice-${order._id.toString().slice(-8).toUpperCase()}.pdf`
  );
  doc.pipe(res);

  // Header
  doc.rect(0, 0, doc.page.width, 100).fill('#6366f1');
  doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('Renovi8', 50, 30);
  doc.fontSize(11).font('Helvetica').text('Smart Home Upgrades Made Simple', 50, 62);
  doc.fillColor('#000000');

  // Invoice title
  doc.moveDown(3);
  doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e293b').text('INVOICE', { align: 'right' });
  doc.fontSize(11).font('Helvetica').fillColor('#64748b')
    .text(`Invoice #: ${order._id.toString().slice(-8).toUpperCase()}`, { align: 'right' })
    .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
    .text(`Status: ${order.payment?.status || 'Paid'}`, { align: 'right' });

  doc.moveDown(2);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e2e8f0');
  doc.moveDown(1);

  // Customer info
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#6366f1').text('BILLED TO');
  doc.font('Helvetica').fillColor('#334155')
    .text(order.customer?.name || 'N/A')
    .text(order.customer?.email || '')
    .text(order.customer?.phone || '')
    .text(order.address || '');

  doc.moveDown(2);

  // Service details table header
  doc.fillColor('#6366f1').rect(50, doc.y, 500, 28).fill();
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
    .text('SERVICE', 60, doc.y - 20)
    .text('TYPE', 280, doc.y - 14, { width: 100 })
    .text('DATE', 390, doc.y - 8, { width: 100 })
    .text('AMOUNT', 470, doc.y - 2, { width: 80, align: 'right' });

  doc.moveDown(0.5);

  // Row
  const rowY = doc.y;
  doc.fillColor('#f8fafc').rect(50, rowY, 500, 30).fill();
  doc.fillColor('#334155').fontSize(10).font('Helvetica')
    .text(order.product?.name || 'Service', 60, rowY + 8)
    .text(order.serviceType === 'product+installation' ? 'Product + Install' : 'Product Only', 280, rowY + 8)
    .text(new Date(order.serviceDate).toLocaleDateString(), 390, rowY + 8)
    .text(`£${(order.totalPrice || 0).toFixed(2)}`, 470, rowY + 8, { width: 80, align: 'right' });

  doc.y = rowY + 40;
  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke('#e2e8f0');
  doc.moveDown(1);

  // Total
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#1e293b')
    .text(`TOTAL: £${(order.totalPrice || 0).toFixed(2)}`, { align: 'right' });

  doc.moveDown(3);
  doc.fontSize(10).font('Helvetica').fillColor('#94a3b8')
    .text('Thank you for choosing Renovi8!', { align: 'center' })
    .text('© 2026 Renovi8. Smart Home Upgrades Made Simple.', { align: 'center' });

  doc.end();
};

module.exports = generateInvoicePDF;
