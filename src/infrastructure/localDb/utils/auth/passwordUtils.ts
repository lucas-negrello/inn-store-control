export const hashPassword = async (plain: string): Promise<string> => {
    const enc = new TextEncoder().encode(plain);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    const arr = Array.from(new Uint8Array(digest));
    return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const verifyPassword = async (plain: string, hash: string): Promise<boolean> => {
    const h = await hashPassword(plain);
    return h === hash;
}