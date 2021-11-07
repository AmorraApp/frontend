
import PropTypes from 'prop-types';
import { forwardRef, createContext, useContext, useRef, useEffect } from 'react';
import { cl as classNames } from 'common/utils';
import useStableMemo from 'common/hooks/useStableMemo';
import useIsobound, { IsoboundContextProvider, IsoboundOutput } from 'common/ui/useIsobound';
import Transition from 'common/ui/transition';
import { v4 as uuid } from 'uuid';

import * as styles from './panelstack.scss';
// import { cl as classNames, assert } from 'common/utils';
import useStackContext from './useStackContext';

export const PanelContext = createContext(null);
PanelContext.displayName = 'PanelContext';

export function usePanelContext () {
  return useContext(PanelContext) || {
    isRoot: true,
    pathString: '',
    path: [ '' ],
  };
}

const propTypes = {
  panelKey: PropTypes.string,
  variant: PropTypes.oneOf([ 'flat', 'floating' ]),
  animate: PropTypes.bool,
};

export default function Panel (Component, { outerClassName, outerVariant } = {}) {
  const WrappedPanel = forwardRef(({ panelKey, className, variant, animate, ...props }, ref) => {
    const key = useStableMemo(() => panelKey || uuid(), [ panelKey ]);
    const { variant: stackVariant, isActive, history, trackAnimation } = useStackContext();
    const parent = usePanelContext();

    const activeRef = useRef({ active: false, show: false });
    const panel = useStableMemo(() => {
      const path = [ ...parent.path, key ];

      return {
        get show () { return activeRef.current.show; },
        get active () { return activeRef.current.active; },
        key,
        path,
        pathString: path.join('/'),
        parent,
        width: 400,
      };
    }, [ key, parent.pathString ]);

    activeRef.current.show = isActive(panel.path);
    activeRef.current.active = (activeRef.current.active || activeRef.current.show);

    useEffect(() => {
      if (history._seed) return;
      // on mount, check if the stack has received a root yet
      // if it hasn't make this panel the root.
      history._seed = [ ...panel.path ];

      // if for some reason this root dismounts, clear the seed.
      return () => {
        history._seed = null;
      };
    }, []);

    variant = variant || outerVariant || stackVariant;

    const body = (
      <IsoboundContextProvider>
        <PanelContext.Provider value={panel}>
          <Transition
            appear={animate}
            in={activeRef.current.show}
            classEntering={[ styles.opening ]}
            classEntered={[ styles.open ]}
            classExiting={[ styles.closing ]}
            classExited={[ styles.closed ]}
            onEntering={trackAnimation.start}
            onEntered={trackAnimation.stop}
          >
            <div
              ref={ref}
              className={classNames(
                styles.panel,
                outerClassName,
                className,
                variant && styles['panel-' + variant],
              )}
              data-key={panel.key}
            >
              {activeRef.current.active && (
                <Component
                  {...props}
                  key={panel.key}
                  ref={ref}
                  panel={panel}
                  history={history}
                />
              )}
            </div>
          </Transition>
          <IsoboundOutput />
        </PanelContext.Provider>
      </IsoboundContextProvider>
    );

    if (parent.isRoot) return body;

    const Isobound = useIsobound(body);
    Isobound.displayName = (WrappedPanel.displayName || Component.displayName || Component.name || 'AnonymousPanel') + 'Binding';

    return null;
  });
  WrappedPanel.displayName = Component.displayName || Component.name || 'AnonymousPanel';
  WrappedPanel.propTypes = propTypes;
  WrappedPanel.defaultProps = {
    animate: true,
  };

  return WrappedPanel;
}

