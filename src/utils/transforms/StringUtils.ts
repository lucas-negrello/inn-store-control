export const capitalizeFirst = (s: string) => {
    if (s.length === 0) return s;
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export const capitalizeAll = (s: string) => {
    if (s.length === 0) return s;
    return s.split(' ').map(word => capitalizeFirst(word)).join(' ');
}