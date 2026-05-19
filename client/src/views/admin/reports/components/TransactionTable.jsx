import React from "react";
import { formatRupiah } from "../../../../utils/format";

export default function TransactionTable({ data }) {
  if (!data.length) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 font-bold">Detail Transaksi Completed</h3>

        <div className="py-10 text-center text-gray-400">
          Belum ada transaksi completed
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl bg-white p-4 shadow">
      <h3 className="mb-4 font-bold">Detail Transaksi</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Tanggal</th>
              <th>Customer</th>
              <th>No HP</th>
              <th>Produk</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {data.map((trx) => (
              <tr key={trx.id} className="border-b">
                <td className="py-2">
                  {new Date(trx.createdAt).toLocaleDateString("id-ID")}
                </td>

                <td>{trx.customer?.name}</td>

                <td>{trx.customer?.phoneNumber}</td>

                <td>
                  {trx.items?.map((item, i) => (
                    <div key={i} className="mb-1">
                      <span className="font-medium">
                        {item.variant?.product?.nama || "Produk dihapus"}
                      </span>{" "}
                      ({item.variant?.nama_variant || "Default"}) x
                      {item.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  <span
                    className={`rounded px-2 py-1 text-xs${trx.fulfillmentStatus === "completed"? "bg-green-100 text-green-600": "bg-yellow-100 text-yellow-600"}`}
                  >
                    {trx.fulfillmentStatus}
                  </span>
                </td>

                <td>{formatRupiah(trx.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
