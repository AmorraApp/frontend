import PropTypes from 'prop-types';
import { useRef, useEffect, useCallback, forwardRef, createContext, useContext, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import useWillUnmount from 'common/hooks/useWillUnmount';
import useForceUpdate from 'common/hooks/useForceUpdate';
import { map, isFunction } from 'common/utils';
import useComputedRef from 'common/hooks/useComputedRef';

export const MountContext = createContext(null);
MountContext.displayName = 'MountContext';


export function MountProvider ({ children }) {
  const manager = useComputedRef(() => new BodyMountManager);
  const orphanage = useComputedRef(() => new Map);

  const attachOrphan = useCallback((bindKey, binding) => {
    orphanage.set(bindKey, binding);
    orphanage.update();
  });

  const detatchOrphan = useCallback((bindKey) => {
    orphanage.delete(bindKey);
    orphanage.uupdate();
  });

  return (
    <MountContext.Provider value={{ manager, orphanage, attachOrphan, detatchOrphan }}>
      {children}
      <Orphanage orphanage={orphanage} />
    </MountContext.Provider>
  );
}


function Orphanage ({ orphanage }) {
  orphanage.update = useForceUpdate();

  if (!orphanage.size) return null;

  return map(orphanage, (Component, k, i) => {
    if (isFunction(Component)) return <Component key={i} />;
    return cloneElement(Component, { key: i });
  });
}
Orphanage.propTypes = {
  orphanage: PropTypes.instanceOf(Map),
};


export const BodyMount = forwardRef(({ children, source }, ref) => {
  const { manager } = useContext(MountContext);
  const mountRef = useComputedRef(() => manager.attach({ ref, source }));
  const [ mountPoint, dispose ] = mountRef.current;

  useWillUnmount(dispose);

  return createPortal(<>{children}</>, mountPoint);
});
BodyMount.displayName = 'BodyMount';
BodyMount.propTypes = {
  source: PropTypes.string,
};

class BodyMountManager {

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

}

export function useOrphanage () {
  const { orphans } = useContext(MountContext);

  return {
    createOrphan (orphan) {
      const id = Symbol('Orphan');
      orphans.set(id, orphan);
      orphans.updated && orphans.updated();
      return () => {
        orphans.delete(id);
        orphans.updated && orphans.updated();
      };
    },
  };
}

export function useOrphan (body) {
  const { orphans } = useContext(MountContext);
  const bodyRef = useRef(body);
  bodyRef.current = body;

  const Orphan = useCallback(() => bodyRef.current);

  useEffect(() => {
    const id = Symbol('Orphan');
    orphans.set(id, Orphan);
    orphans.updated && orphans.updated();
    return () => {
      orphans.delete(id);
      orphans.updated && orphans.updated();
    };
  }, []);

}
