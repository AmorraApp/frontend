import Grid from 'common/ui/grid';
// import { Fragment } from 'react';
import Text, { Monospace } from 'common/ui/text';

export default function Texts () {
  return (
    <div>
      <h2>Text Control <Monospace variant="small">common/ui/text</Monospace></h2>
      <Grid spaced columns={5}>
        <Text>Default</Text>

        {Text.VARIANTS.map((v) => (
          <Text key={v} variant={v}>{v}</Text>
        ))}
      </Grid>
    </div>
  );
}
