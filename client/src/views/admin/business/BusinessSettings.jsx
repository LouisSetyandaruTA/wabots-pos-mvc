import React,
{
  useEffect,
  useState
} from "react";

import axios
from "../../../utils/axiosInstance";

import Card
from "components/card";

export default function BusinessSettings() {

  const [loading, setLoading]
    = useState(true);

  const [saving, setSaving]
    = useState(false);

  const [form, setForm]
    = useState({

    name: "",
    description: "",
    address: "",
    phone: "",
    openHours: "",
    faq: ""

  });

  useEffect(() => {

    fetchBusiness();

  }, []);

  const fetchBusiness =
  async () => {

    try {

      const res =
        await axios.get(
          "/business/me"
        );

      setForm({

        name:
          res.data.name || "",

        description:
          res.data.description || "",

        address:
          res.data.address || "",

        phone:
          res.data.phone || "",

        openHours:
          res.data.openHours || "",

        faq:
          res.data.faq || ""

      });

    } catch (err) {

      console.error(err);

      alert(
        "Gagal mengambil data bisnis"
      );

    } finally {

      setLoading(false);

    }
  };

  const handleSave =
  async () => {

    try {

      setSaving(true);

      await axios.put(
        "/business/me",
        form
      );

      alert(
        "Business berhasil diupdate"
      );

    } catch (err) {

      console.error(err);

      alert(
        "Gagal update business"
      );

    } finally {

      setSaving(false);

    }
  };

  if (loading) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (

    <div className="p-6">

      <Card extra="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Business Settings
        </h1>

        <div className="grid grid-cols-1 gap-4">

          <div>
            <label className="font-semibold">
              Nama Business
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Deskripsi
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Alamat
            </label>

            <textarea
              rows={3}
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Nomor Telepon
            </label>

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Jam Operasional
            </label>

            <input
              type="text"
              value={form.openHours}
              onChange={(e) =>
                setForm({
                  ...form,
                  openHours: e.target.value
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              FAQ Business
            </label>

            <textarea
              rows={8}
              value={form.faq}
              onChange={(e) =>
                setForm({
                  ...form,
                  faq: e.target.value
                })
              }
              className="border p-3 rounded w-full"
              placeholder="
Contoh:
- Bisa QRIS
- Bisa delivery
- Free wifi
- Minimal order 20rb
              "
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              bg-blue-500
              text-white
              px-5
              py-3
              rounded
              mt-4
            "
          >
            {
              saving
              ? "Menyimpan..."
              : "Simpan Business"
            }
          </button>

        </div>

      </Card>

    </div>
  );
}