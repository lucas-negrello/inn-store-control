const base64Url = (uint8: Uint8Array) => {
    return btoa(String.fromCharCode(...uint8))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const generateToken = (bytes: number = 32) => {
    const arr = crypto.getRandomValues(new Uint8Array(bytes));
    return base64Url(arr);
};

