import Grid from 'common/ui/grid';
import Sync from 'common/svgs/solid/sync-alt.svg';
import Spinner from 'common/ui/spinner';
import { Monospace } from 'common/ui/text';

export default function Spinners () {
  return (
    <div>
      <h2>Spinners <Monospace variant="small">common/ui/spinner</Monospace></h2>

      <strong>Custom</strong>
      <Grid.Row spaced>
        <Spinner animation="rotate" size="sm"><Sync /></Spinner>
        <Spinner animation="rotate"><Sync /></Spinner>
        <Spinner animation="rotate" size="lg"><Sync /></Spinner>
        <Spinner animation="rotate" size="xl"><Sync /></Spinner>
      </Grid.Row>

      <strong>Border</strong>
      <Grid.Row spaced>
        <Spinner animation="border" size="sm" />
        <Spinner animation="border" />
        <Spinner animation="border" size="lg" />
        <Spinner animation="border" size="xl" />
      </Grid.Row>

      <strong>Grow</strong>
      <Grid.Row spaced>
        <Spinner animation="grow" size="sm" />
        <Spinner animation="grow" />
        <Spinner animation="grow" size="lg" />
        <Spinner animation="grow" size="xl" />
      </Grid.Row>

      <strong>Blades</strong>
      <Grid.Row spaced>
        <Spinner animation="blades" size="sm" />
        <Spinner animation="blades" />
        <Spinner animation="blades" size="lg" />
        <Spinner animation="blades" size="xl" />
      </Grid.Row>

      <strong>Ellipsis</strong>
      <Grid.Row spaced>
        <Spinner animation="ellipsis" size="sm" />
        <Spinner animation="ellipsis" />
        <Spinner animation="ellipsis" size="lg" />
        <Spinner animation="ellipsis" size="xl" />
      </Grid.Row>
    </div>
  );
}
