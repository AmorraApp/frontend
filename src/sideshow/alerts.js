
import Alert from 'common/ui/alert';
import Grid from 'common/ui/grid';
import { Monospace } from 'common/ui/text';

export default function Alerts () {
  return (
    <div>
      <h2>Alerts <Monospace variant="small">common/ui/alert</Monospace></h2>

      <Grid.Column spaced>
        {Alert.VARIANTS.map((v) => (
          <Alert
            key={v}
            show
            variant={v}
            closable
          >Variant: {v}</Alert>
        ))}
      </Grid.Column>

    </div>
  );
}
