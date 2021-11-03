import quickContext from 'common/quickcontext';
import useGettableState from 'common/hooks/useGettableState';
import useImmediateUpdateEffect from 'common/hooks/useImmediateUpdateEffect';

const [ useDrawerContext, DrawerContextProvider ] = quickContext('DrawerContext', ({ open = false, align }) => {
  const [ activeKey, setter, getter ] = useGettableState(open);

  useImmediateUpdateEffect(() => {
    if (open !== getter()) setter(open);
  }, [ open ]);

  return { activeKey, setActiveKey: setter, getActiveKey: getter, align };
});

export default useDrawerContext;
export { DrawerContextProvider };
