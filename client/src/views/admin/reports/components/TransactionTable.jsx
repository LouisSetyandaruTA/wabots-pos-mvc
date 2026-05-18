import React from "react";
import { formatRupiah } from "../../../../utils/format";

export default function TransactionTable({ data }) {
  if (!data.length) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h3 className="font-bold mb-4">
        Detail Transaksi Completed
      </h3>

      <div className="text-gray-400 text-center py-10">
        Belum ada transaksi completed
      </div>
    </div>
  );
}

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <h3 className="font-bold mb-4">Detail Transaksi</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Tanggal</th>
              <th>Customer</th>
              <th>No HP</th>
              <th>Produk</th>
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
                  {trx.items?.map((item,i)=>(
                    <div key={i}>
                      {item.variant?.Product?.nama} ({item.quantity})
                    </div>
                  ))}
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