function errWrapper(err) {
  switch (err.code === "P2002") {
    case true:
      return [
        { err: true, msg: `fields [ ${err.meta.target}] is already taken.` },
      ];
    default:
      return [
        { err: true, msg: `error code ${err.code} , message: ${err.message}` },
      ];
  }
}

module.exports = {
  errWrapper,
};
