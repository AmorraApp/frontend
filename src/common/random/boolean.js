
export default function Bool (odds = 50) {
  if (odds === true) odds = 50;
  if (odds === false) return () => false;

  return () => Math.random() * 100 <= odds;
}
