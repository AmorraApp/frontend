
import { r, Picker, Concat } from './_utils';
import OrganizationNoun from './org-noun';
import Verb from './verb';

const Word = Picker([ Verb, OrganizationNoun ]);
const ACTIONATE = /(\w+[^aeiou])([aeiou]+)([\w^aeiou]+)|\w+/g;

const Startup = Picker([
  Concat(Word, 'it'),
  Concat(Word, 'ly'),
  Concat(Word, 'ify'),
  Concat(Word, 'hub'),
  Concat(Word, 'me'),
  Concat(Word, 'str'),
  Concat(Word, 'Now'),
  Concat(Word, 'Link'),
  Concat(Word, 'in'),
  Concat(Word, 'able'),
  Concat(Word, 'r'),
  Concat('You', Word),
  Concat('Smart', Word),
  Concat('Just ', Word),
  () => {
    const word = r(Word);
    const [ , first, , last ] = ACTIONATE.exec(word) || [];
    if (first && last) return first + last;
    return word;
  },
]);

export default Startup;
