export const error = (err: Error) => {
    console.log(err);
    return null;
};

export const throwError = (err: Error) => {
    throw err;
};
