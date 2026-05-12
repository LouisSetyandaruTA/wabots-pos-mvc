exports.cleanCustomerName = (text) => {

    let name = text.toLowerCase();

    name = name.replace("nama saya", "");
    name = name.replace("nama aku", "");
    name = name.replace("nama ku", "");
    name = name.replace("saya", "");
    name = name.replace("aku", "");

    name = name.replace(/[.,!?]/g, "");

    name = name.trim();

    name = name
        .split(" ")
        .map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

    return name;
};

exports.isEmptyMessage = (text) => {
    return !text || text.trim().length === 0;
};

exports.isMediaMessage = (msg) => {
    return msg.hasMedia;
};

exports.isValidCustomerName = (name) => {

    if (!name) return false;

    // MINIMAL 2 KARAKTER
    if (name.length < 2) {
        return false;
    }

    // HANYA HURUF DAN SPASI
    const regex = /^[A-Za-z\s]+$/;

    if (!regex.test(name)) {
        return false;
    }

    // MINIMAL ADA 1 HURUF
    const hasLetter = /[A-Za-z]/.test(name);

    if (!hasLetter) {
        return false;
    }

    return true;
};