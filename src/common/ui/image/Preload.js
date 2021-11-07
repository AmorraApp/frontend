import { cl as classNames, isString } from 'common/utils';
import { forwardRef, useCallback, Children } from 'react';
import PropTypes from 'prop-types';
import styles from './image.scss';
import useDerivedState from 'common/hooks/useDerivedState';
import Ratio from 'common/ui/ratio';
import Spinner from 'common/ui/spinner';
import { cloneChildren } from 'common/children';

export const propTypes = {
  /**
   * This component requires a single child element
   */
  children: PropTypes.element.isRequired,

  onLoad: PropTypes.func,
  spinner: PropTypes.oneOf([ true, ...Spinner.ANIMATIONS ]),

  src: PropTypes.string,
};



const Preload = forwardRef(({
  onLoad,
  spinner,
  className,
  children,
  ...props
}, ref) => {

  const [ loaded, setLoaded ] = useDerivedState(false, [ props.src ]);

  const handleLoaded = useCallback((ev) => {
    setLoaded(true);
    onLoad && onLoad(ev);
  });

  return (
    <>
      {cloneChildren(Children.only(children), (child) => ({
        ...child.props,
        ref,
        onLoad: handleLoaded,
        className: classNames(
          child.className,
          !loaded && styles.hide,
        ),
      }))}
      {!loaded && (
        <Ratio>
          <div className={classNames(styles.spinner, className)}>
            <Spinner animation={isString(spinner) ? spinner : 'border'} size="xl" className={styles.spinner} />
          </div>
        </Ratio>
      )}
    </>
  );
});

Preload.displayName = 'Preload';
Preload.propTypes = propTypes;
export default Preload;
