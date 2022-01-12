import Grid from 'common/ui/grid';
import { Monospace } from 'common/ui/text';

export default function Grids () {
  return (
    <div>
      <h2>Grids <Monospace variant="small">common/ui/grid</Monospace></h2>

      <Grid.Column justify="center">
        <span style={{ flex: 0, background: '#ccc' }}>Centered Column</span>
        <Grid.Column.Divider />
        <span style={{ flex: 0, background: '#ccc' }}>Text Below</span>
      </Grid.Column>

      <Grid.Column justify="stretch">
        <span style={{ flex: 1, background: '#ccc' }}>Stretched Column</span>
        <Grid.Column.Divider />
        <span style={{ flex: 1, background: '#ccc' }}>Text Below</span>
      </Grid.Column>

    </div>
  );
}
