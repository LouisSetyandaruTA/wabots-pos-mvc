// const sessions = {};

// const SESSION_TIMEOUT = 30 * 60 * 1000;

// exports.getSession = (phone) => {
//   const session = sessions[phone];

//   if (!session) return null;

//   const now = Date.now();

//   if (now - session.lastActivity > SESSION_TIMEOUT) {
//     delete sessions[phone];

//     return {
//       expired: true,
//     };
//   }

//   return session;
// };

// exports.setSession = (phone, data) => {
//   sessions[phone] = {
//     ...sessions[phone],
//     ...data,
//     lastActivity: Date.now(),
//   };
// };

// exports.clearSession = (phone) => {
//   delete sessions[phone];
// };

// exports.isSessionExpired = (session) => {
//   return session?.expired === true;
// };

const sessions = {};

const SESSION_TIMEOUT = 30 * 60 * 1000;

const FINISHED_TIMEOUT = 5 * 60 * 1000;

exports.getSession = (phone) => {
  const session = sessions[phone];

  if (!session) return null;

  const now = Date.now();

  if (
    session.orderFinished &&
    now - session.orderFinishedAt > FINISHED_TIMEOUT
  ) {
    delete sessions[phone];

    return {
      expired: true,
    };
  }

  if (now - session.lastActivity > SESSION_TIMEOUT) {
    delete sessions[phone];

    return {
      expired: true,
    };
  }

  return session;
};

exports.setSession = (phone, data) => {
  sessions[phone] = {
    ...sessions[phone],

    ...data,

    lastActivity: Date.now(),
  };
};

exports.clearSession = (phone) => {
  delete sessions[phone];
};

exports.isSessionExpired = (session) => {
  return session?.expired === true;
};
