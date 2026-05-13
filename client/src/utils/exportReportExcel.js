import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportReportExcel = (data) => {
  const workbook = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.json_to_sheet([
    {
      TotalRevenue: data.summary.totalRevenue,
      TotalOrders: data.summary.totalOrders,
      AOV: data.summary.avgOrderValue
    }
  ]);

  XLSX.utils.book_append_sheet(
    workbook,
    summarySheet,
    "Summary"
  );

const transactionSheet = XLSX.utils.json_to_sheet(
  data.transactions.map((t) => ({

    Customer: t.customer?.name,

    Phone: t.customer?.phoneNumber,

    Products: t.items.map(i =>
      `${i.variant?.product?.nama} (${i.quantity}x)`
    ).join(", "),

    DeliveryMethod: t.deliveryMethod,

    Fulfillment: t.fulfillmentStatus,

    Total: t.totalPrice
  }))
);

  XLSX.utils.book_append_sheet(
    workbook,
    transactionSheet,
    "Transactions"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array"
    }
  );

  const fileData = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
  );

  saveAs(fileData, "report.xlsx");
};