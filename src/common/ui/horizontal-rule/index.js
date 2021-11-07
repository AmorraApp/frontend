
import PropTypes from 'prop-types';
import styles from './horizontal-rule.scss';
import { cl } from 'common/utils';

export default function HorizontalRule ({ className, ...rest }) {
  const classes = [
    className,
    styles.hr,
  ];

  return (
    <hr className={cl(classes)} {...rest} />
  );
}

HorizontalRule.propTypes = {
  className: PropTypes.string,
};
