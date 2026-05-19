import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportReportPDF = (data, filter) => {
  const pdf = new jsPDF();

  const { summary, trends, topProducts, transactions } = data;

  const start = filter.startDate;
  const end = filter.endDate;

  // 🔷 HEADER
  pdf.setFontSize(18);
  pdf.text("LAPORAN PENJUALAN", 14, 15);

  pdf.setFontSize(10);
  pdf.text(`Periode: ${start} s/d ${end}`, 14, 22);

  pdf.line(14, 25, 196, 25);

  // 🔷 RINGKASAN
  pdf.setFontSize(12);
  pdf.text("Ringkasan", 14, 35);

  autoTable(pdf, {
    startY: 38,
    head: [["Metric", "Nilai"]],
    body: [
      ["Total Revenue", `Rp ${summary.totalRevenue.toLocaleString("id-ID")}`],
      ["Total Orders", summary.totalOrders],
      [
        "AOV",
        `Rp ${Math.round(summary.avgOrderValue).toLocaleString("id-ID")}`,
      ],
      ["Pending Orders", summary.pendingOrders],
      ["Paid Orders", summary.paidOrders],
      ["Ready Pickup", summary.readyPickupOrders],
      ["Shipping", summary.shippingOrders],
      ["Completed", summary.completedOrders],
    ],
  });

  // 🔷 TRENDS
  pdf.text("Penjualan per Hari", 14, pdf.lastAutoTable.finalY + 10);

  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 13,
    head: [["Tanggal", "Revenue", "Orders"]],
    body: trends.map((t) => [
      t.period,
      `Rp ${Number(t.revenue).toLocaleString("id-ID")}`,
      t.orders,
    ]),
  });

  // 🔷 TOP PRODUCTS
  pdf.text("Produk Terlaris", 14, pdf.lastAutoTable.finalY + 10);

  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 13,
    head: [["Produk", "Terjual", "Revenue"]],
    body: topProducts.map((p) => [
      p.productName,
      p.totalSold,
      `Rp ${Number(p.revenue).toLocaleString("id-ID")}`,
    ]),
  });

  // 🔷 TRANSAKSI DETAIL
  pdf.text("Detail Transaksi", 14, pdf.lastAutoTable.finalY + 10);

  autoTable(pdf, {
    startY: pdf.lastAutoTable.finalY + 13,
    head: [["Customer", "Produk", "Metode", "Status", "Total"]],
    body: transactions.map((t) => [
      t.customer?.name || "-",

      t.items
        ?.map(
          (i) =>
            `${i.variant?.product?.nama || "Produk dihapus"}
          (${i.variant?.nama_variant || "Default"})
          x${i.quantity}`
        )
        .join(", "),

      t.deliveryMethod || "-",

      t.fulfillmentStatus || "-",

      `Rp ${Number(t.totalPrice).toLocaleString("id-ID")}`,
    ]),
  });

  // 🔷 FOOTER
  const pageCount = pdf.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.text(`Halaman ${i} dari ${pageCount}`, 170, 290);
  }

  // 🔷 SAVE FILE
  pdf.save(`laporan-${start}_sampai_${end}.pdf`);
};
