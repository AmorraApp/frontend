import { cl as classNames, isString, isObject, isArray, keyBy, map, threepiece } from 'common/utils';
import { forwardRef, useRef, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as styles from './turntable.scss';
import ChevronLeft from 'common/svgs/solid/chevron-left.svg';
import ChevronRight from 'common/svgs/solid/chevron-right.svg';
import useStableMemo from 'common/hooks/useStableMemo';
import useChildren from 'common/hooks/useChildren';
import useGettableState from 'common/hooks/useGettableState';
import { mapChildren } from 'common/children';
import Cell from './Cell';
import Lightbox from 'common/ui/lightbox';
import useScroll from 'common/hooks/useScroll';

const propTypes = {
  pageSize: PropTypes.number,
  images: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      src: PropTypes.string,
      srcSet: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
      ]),
      sizes: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ])),
};

const Turntable = forwardRef(({
  pageSize = 0.8,
  images = [],

  className,
  children,
}, ref) => {

  const derivedImages = useChildren(children, () => parseChildren(children));

  images = useStableMemo(
    () => {
      const normalized = images.map((img) => {
        if (isString(img)) img = { src: img, href: img };
        else if (isArray(img)) img = { src: img[0], href: img[1] || img[0] };
        if (!isObject(img) || !img.src) return null;
        return { ...img };
      });

      const combined = derivedImages.concat(normalized).filter(Boolean);
      const siblings = threepiece(combined, (p, c, n) => ({
        ...c[1],
        prevKey: p && p[1] && p[1].src,
        nextKey: n && n[1] && n[1].src,
      }));

      return keyBy(siblings, 'src');
    },
    [ images, derivedImages ],
    true,
  );
  const imageCount = Object.keys(images).length;

  const [ lightbox, setLightbox ] = useState(null);
  const [ nav, updateNavState ] = useGettableState({
    visible: imageCount > 4,
    atStart: true,
    atEnd: false,
  }, {
    alwaysMerge: true,
    onlyUpdateOnDiff: true,
  });

  useEffect(() => {
    // reset the nav state if the image length changes
    updateNavState({
      visible: imageCount > 4,
      atStart: true,
      atEnd: false,
    });
  }, [ imageCount ]);

  const scrollerRef = useRef();
  const scroll = useScroll(scrollerRef, { easing: 'emphasized' });

  const trayRef = useRef();
  const [ baseHeight, setBaseHeight ] = useGettableState(0, {
    alwaysMerge: true,
    onlyUpdateOnDiff: true,
  });
  useEffect(() => {
    const h = trayRef.current?.offsetHeight;
    if (h) setBaseHeight(h);
  });

  const handlePrevClick = useCallback(() => {
    const s = scrollerRef.current;
    const x = s.offsetWidth * -pageSize;
    scroll({ x });
  }, [ pageSize ]);

  const handleNextClick = useCallback(() => {
    const s = scrollerRef.current;
    const x = s.offsetWidth * pageSize;
    scroll({ x });
  });

  const handleCellClick = useCallback((img, ev) => {
    if (img.onClick) {
      img.onClick(ev);
      if (ev.defaultPrevented) {
        setLightbox(null);
        return;
      }
    }

    const { src, href, ...image } = img || {};
    image.src = href || src;
    if (image.src) setLightbox(image);
  });

  const updateNav = useCallback(() => {
    const s = scrollerRef.current;
    if (!s) return;
    const visible = s.scrollWidth > s.offsetWidth;
    const atStart = s.scrollLeft <= 1;
    const atEnd = s.scrollLeft + s.offsetWidth + 1 >= s.scrollWidth;

    updateNavState({
      visible,
      atStart,
      atEnd,
    });
  });

  const handleTurntableChange = useCallback((key) => {
    const { src, href, ...image } = images[key] || {};
    image.src = href || src;
    if (image.src) setLightbox(image);
    else setLightbox(null);
  });

  return (
    <div className={classNames(className, styles.root, nav.visible ? styles['show-nav'] : styles['hide-nav'])} ref={ref}>
      <div className={styles.scroller} ref={scrollerRef} onScroll={updateNav}>
        <div ref={trayRef} className={styles.tray}>
          {map(images, (img) => <Cell key={img.src} baseHeight={baseHeight} {...img} onClick={handleCellClick} onLoad={updateNav} />)}
        </div>
      </div>
      <div className={classNames(styles.left,  nav.atStart && styles.disabled)} onClick={handlePrevClick}><ChevronLeft /></div>
      <div className={classNames(styles.right,   nav.atEnd && styles.disabled)} onClick={handleNextClick}><ChevronRight /></div>
      <Lightbox
        show={!!lightbox}
        {...lightbox}
        onHide={useCallback(() => setLightbox(null))}
        onChange={handleTurntableChange}
      />
    </div>
  );

});
Turntable.displayName = 'ImageTurntable';
Turntable.propTypes = propTypes;

export default Turntable;

function parseChildren (children) {
  return mapChildren(children, (child) => {
    if (child.type !== 'img') return;

    if (child.ref) return { ...child.props, ref: child.ref };
    return child.props;
  }).filter(Boolean);
}
