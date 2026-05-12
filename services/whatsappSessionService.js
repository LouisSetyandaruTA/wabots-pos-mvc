const sessions = {};

const SESSION_TIMEOUT = 30 * 60 * 1000;

exports.getSession = (phone) => {

    const session = sessions[phone];

    if (!session) return null;

    const now = Date.now();

    if (now - session.lastActivity > SESSION_TIMEOUT) {

        delete sessions[phone];

        return null;
    }

    return session;
};

exports.setSession = (phone, data) => {

    sessions[phone] = {
        ...sessions[phone],
        ...data,
        lastActivity: Date.now()
    };
};

exports.clearSession = (phone) => {
    delete sessions[phone];
};