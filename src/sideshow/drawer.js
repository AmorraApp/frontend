import Drawer from 'common/ui/drawer';
import { Monospace } from 'common/ui/text';

export default function Dropdowns () {
  return (
    <div>
      <Drawer.Container
        align="right"
        justify="center"
        contain
      >
        <Drawer width={300} caption="Drawer 1">
          Drawer 1
        </Drawer>

        <Drawer width={300} caption="Drawer 2" variant="warning">
          Drawer 2
        </Drawer>

        <h2>Drawers <Monospace variant="small">common/ui/drawer</Monospace></h2>
        <div style={{ height: 400 }} />

      </Drawer.Container>
    </div>
  );
}
