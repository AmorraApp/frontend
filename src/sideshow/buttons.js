import Button from 'common/ui/button';
import Grid from 'common/ui/grid';
import At from 'common/svgs/solid/at.svg';
import { Fragment } from 'react';
import Text, { Monospace } from 'common/ui/text';

export default function Buttons () {
  return (
    <div>
      <h2>Buttons <Monospace variant="small">common/ui/button</Monospace></h2>
      <Grid spaced columns={7}>
        <div><Button>Default Button</Button></div>
        <div><Button active>Active</Button></div>
        <div><Button disabled>Disabled</Button></div>
        <div><Button block>Block</Button></div>
        <div><Button gutterless><At /></Button> Gutterless</div>
        <div><Button size="sm">Small Button</Button></div>
        <div><Button size="lg">Large Button</Button></div>
      </Grid>
      <hr />
      <h3>Variants</h3>
      <Grid columns={4} spaced >
        {Button.VARIANTS.map((v) => (
          <Fragment key={v}>
            <Text variant={[ 'centered', 'monospace' ]}>{v}</Text>
            <Button variant={v}>Plain</Button>
            <Button variant={v} active>Active</Button>
            <Button variant={v} disabled>Disabled</Button>
          </Fragment>
        ))}
      </Grid>
    </div>
  );
}
