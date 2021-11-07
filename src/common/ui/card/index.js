import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import divWithClassName from '../divWithClassName';
import styles from './card.scss';
export { styles as Classes };

import CardImg from './CardImg';

const CardBody = divWithClassName(styles['card-body'], 'CardBody');
const CardTitle = divWithClassName(styles['card-title'], 'CardTitle', { as: 'h5' });
const CardSubtitle = divWithClassName(styles['card-subtitle'], 'CardSubtitle', { as: 'h6' });
const CardLink = divWithClassName(styles['card-link'], 'CardLink', { as: 'a' });
const CardText = divWithClassName(styles['card-text'], 'CardText', { as: 'p' });
const CardHeader = divWithClassName(styles['card-header'], 'CardHeader');
const CardFooter = divWithClassName(styles['card-footer'], 'CardFooter');
const CardImgOverlay = divWithClassName(styles['card-img-overlay'], 'CardImgOverlay');
const CardColumns = divWithClassName(styles['card-columns'], 'CardColumns');
const CardDeck = divWithClassName(styles['card-deck'], 'CardDeck');
const CardGroup = divWithClassName(styles['card-group'], 'CardGroup');

const propTypes = {

  /**
     * Sets card background
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
     */
  bg: PropTypes.string,

  /**
     * Sets card text color
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light'|'white'|'muted')}
     */
  text: PropTypes.string,

  /**
     * Sets card border color
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
     */
  border: PropTypes.string,

  /**
     * When this prop is set, it creates a Card with a Card.Body inside
     * passing the children directly to it
     */
  body: PropTypes.bool,

  as: PropTypes.elementType,

  className: PropTypes.string,

  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

const defaultProps = {
  body: false,
};

const Card = forwardRef((
  { className,
    bg,
    text,
    border,
    body,
    children,
    as: Component = 'div',
    ...props
  },
  ref,
) => (
  <Component
    ref={ref}
    {...props}
    className={classNames(
      className,
      styles.card,
      bg && styles[`bg-${bg}`],
      text && styles[`text-${text}`],
      border && styles[`border-${border}`],
    )}
  >
    {body ? (<CardBody>{children}</CardBody>) : (children)}
  </Component>
));

Card.displayName = 'Card';
Card.propTypes = propTypes;
Card.defaultProps = defaultProps;
Card.Img = CardImg;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Body = CardBody;
Card.Link = CardLink;
Card.Text = CardText;
Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.ImgOverlay = CardImgOverlay;
Card.Columns = CardColumns;
Card.Deck = CardDeck;
Card.Group = CardGroup;
export default Card;
