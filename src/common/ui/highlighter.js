import PropTypes from 'prop-types';
import { isArray, isString } from 'common/utils';

const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Highlighter = ({ text = '', targets }) => {
  if (isString(targets)) targets = targets.split(/\s+/);
  if (!isArray(targets)) targets = [ targets ];
  targets = targets.filter((s) => s && String(s).trim());

  if (!targets.length) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${targets.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.filter((part) => part).map((part, i) => (
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      ))}
    </span>
  );
};
Highlighter.propTypes = {
  text: PropTypes.string,
  targets: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

export default Highlighter;
