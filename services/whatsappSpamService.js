const spamTracker = {};

const MESSAGE_LIMIT = 5;
const TIME_WINDOW = 10000;

exports.isSpamMessage = (phone) => {

    const now = Date.now();

    if (!spamTracker[phone]) {

        spamTracker[phone] = [];
    }

    // HAPUS MESSAGE LAMA
    spamTracker[phone] = spamTracker[phone].filter(
        (timestamp) => now - timestamp < TIME_WINDOW
    );

    // TAMBAH MESSAGE BARU
    spamTracker[phone].push(now);

    return spamTracker[phone].length > MESSAGE_LIMIT;
};