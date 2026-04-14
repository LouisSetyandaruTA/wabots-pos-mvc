export const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number || 0);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("id-ID").format(number || 0);
};

export const formatAOV = (number) => {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number || 0);
};