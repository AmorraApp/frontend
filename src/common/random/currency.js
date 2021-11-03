

export default function Currency (min = 0, max = 100, { locale = 'en-US', ...options } = {}) {
  options = {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
    ...options,
  };
  const num = () => (Math.random() * (max - min + 1)) + min;
  const formatter = new Intl.NumberFormat(locale, options);
  return () => formatter.format(num());
}
