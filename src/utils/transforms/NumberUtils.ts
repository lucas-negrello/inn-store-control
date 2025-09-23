export const formatCurrency = (value?: string | number, fb?: string, locale = 'pt-BR', currency = 'BRL'): string => {
    if (value == null || value === '') return fb ?? `${new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0)}!`;
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return fb ?? `${new Intl.NumberFormat(locale, { style: 'currency', currency }).format(0)}!`;
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(numberValue);
}