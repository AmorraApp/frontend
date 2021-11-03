

export default function Number (min = 0, max = 100, places = 0) {
  const m = Math.pow(10, places);
  return () => Math.floor( ((Math.random() * (max - min + 1)) + min) * m ) / m;
}
