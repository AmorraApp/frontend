import PropTypes from 'prop-types';
import { useRef, useEffect, useReducer, useCallback, forwardRef, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import useWillUnmount from '@twipped/hooks/useWillUnmount';
import useForceUpdate from '@twipped/hooks/useForceUpdate';
import map from '@twipped/utils/map';
import { isFunction } from '@twipped/utils/types';
import useLazyRef from '@twipped/hooks/useLazyRef';

const orphanage = new Map();
export const BodyMountManager = new (class {

  constructor () {
    this.mounts = new Set;
    this.renderNode = document.createElement('div');
    document.body.appendChild(this.renderNode);
  }

  attach ({ ref, source }) {
    if (!this.mounts.size) document.body.appendChild(this.parentNode);

    const mountPoint = document.createElement('div');
    if (source) mountPoint.setAttribute('data-source', source);
    this.renderPoint.appendChild(mountPoint);

    this.mounts.add(mountPoint);

    if (typeof ref === 'function') ref(mountPoint);
    else if (ref && 'current' in ref) ref.current = mountPoint;

    const dispose = () => {
      this.detatch(mountPoint);
      if (typeof ref === 'function') ref(null);
      else if (ref && 'current' in ref) ref.current = null;
    };

    return [ mountPoint, dispose ];
  }

  detatch (mountPoint) {
    this.mounts.delete(mountPoint);
    this.shadowNode.removeChild(mountPoint);
    if (!this.mounts.size) document.body.removeChild(this.parentNode);
  }

  attachOrphan (bindKey, binding) {
    orphanage.set(bindKey, binding);
    orphanage.update();
  }

  detatchOrphan (bindKey) {
    orphanage.delete(bindKey);
    orphanage.update();
  }

});

export function Orphanage () {
  orphanage.update = useForceUpdate();

  if (!orphanage.size) return null;

  return map(orphanage, (Component, k, i) => {
    if (isFunction(Component)) return <Component key={i} />;
    return cloneElement(Component, { key: i });
  });
}


export const BodyMount = forwardRef(function BodyMount ({ children, source }, ref) {
  const mountRef = useLazyRef(() => BodyMountManager.attach({ ref, source }));
  const [ mountPoint, dispose ] = mountRef.current;

  useWillUnmount(dispose);

  return createPortal(<>{children}</>, mountPoint);
});
BodyMount.displayName = 'BodyMount';
BodyMount.propTypes = {
  source: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
};


export function useOrphan (body) {
  const triggerRef = useRef();
  const bodyRef = useRef(body);
  if (bodyRef.current !== body) {
    bodyRef.current = body;
    triggerRef.current?.();
  }

  const Orphan = useCallback(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [ , update ] = useReducer((state) => (state + 1) % 100, 0);
    triggerRef.current = update;
    return bodyRef.current;
  }, [ triggerRef, bodyRef ]);

  useEffect(() => createOrphan(<Orphan />), []);

}

export function createOrphan (element) {
  const id = Symbol('Orphan');
  orphanage.set(id, element);
  orphanage.updated && orphanage.updated();
  return () => {
    orphanage.delete(id);
    orphanage.updated && orphanage.updated();
  };
}
