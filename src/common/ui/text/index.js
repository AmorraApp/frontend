
import PropTypes from 'common/prop-types';
import { forwardRef } from 'react';
import { cl as classNames } from 'common/utils';
import SafeAnchor from 'common/ui/safe-anchor';

import styles from './text.scss';

const VARIANTS = [
  'centered',
  'monospace',
  'wrap',
  'nowrap',
  'truncate',
  'lowercase',
  'uppercase',
  'capitalize',
  'muted',
  'black-50',
  'white-50',
  'small', 'large',
  'thin', 'lighter', 'light', 'normal', 'semi-bold', 'bold', 'bolder', 'lighter',
  'strong', 'italic',
  'error',
  'code',
  'heading',
  'primary', 'secondary', 'success', 'danger', 'warning', 'info',
  'heading', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
];
const variantProp = PropTypes.oneOf(VARIANTS);
const VNAMES = new Set(VARIANTS);

const propTypes = {
  variant: PropTypes.oneOfType([
    variantProp,
    PropTypes.arrayOf(variantProp),
  ]),

  /**
   * The underlying HTML element to use when rendering the text.
   */
  as: PropTypes.elementType,
};

function parseVariant (input) {
  if (typeof input === 'string') return styles[input];
  if (Array.isArray(input)) return input.flat(Infinity).map(parseVariant);
  return null;
}

const Text = forwardRef(({
  className,
  children,
  variant,
  as: Component = 'span',
  ...props
}, ref) => {
  const remaining = {};
  const variants = [ variant ];
  for (const [ k, v ] of Object.entries(props)) {
    if (VNAMES.has(k)) {
      if (v) variants.push(k);
    } else {
      remaining[k] = v;
    }
  }

  return (
    <Component
      {...remaining}
      ref={ref}
      className={classNames(
        className,
        parseVariant(variants),
      )}
    >{children}</Component>
  );
});
Text.displayName = 'Text';
Text.propTypes = propTypes;
Text.VARIANTS = VARIANTS;

export default Text;

function make (v, name, props = {}) {
  const C = forwardRef(({ variant, ...p }, ref) => (
    <Text
      {...props}
      {...p}
      ref={ref}
      variant={[ v, variant ]}
    />
  ));
  if (name) C.displayName = name;
  C.propTypes = propTypes;
  return C;
}

export const TextMuted = /* #__PURE__*/make('muted', 'TextMuted');
export const TextSmall = /* #__PURE__*/make('small', 'TextSmall', { as: 'small' });
export const Monospace = /* #__PURE__*/make('monospace',  'Monospace');
export const Strong =    /* #__PURE__*/make('bold',  'Strong', { as: 'strong' });
export const ErrorText = /* #__PURE__*/make('error', 'ErrorText');
export const Code =      /* #__PURE__*/make('code',  'Code');
export const H1 =        /* #__PURE__*/make('h1',    'H1', { as: 'h1' });
export const H2 =        /* #__PURE__*/make('h2',    'H2', { as: 'h2' });
export const H3 =        /* #__PURE__*/make('h3',    'H3', { as: 'h3' });
export const H4 =        /* #__PURE__*/make('h4',    'H4', { as: 'h4' });
export const H5 =        /* #__PURE__*/make('h5',    'H5', { as: 'h5' });
export const H6 =        /* #__PURE__*/make('h6',    'H6', { as: 'h6' });
export const Link =      /* #__PURE__*/make('primary',      'Link', { as: SafeAnchor });
