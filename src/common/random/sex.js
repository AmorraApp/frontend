
import Bool from './boolean';

export default function Sex () {
  const isFemale = Bool(52);
  return () => (isFemale() ? 'Female' : 'Male');
}
