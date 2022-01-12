import Grid from 'common/ui/grid';
import { Fragment } from 'react';
import Text, { Monospace } from 'common/ui/text';
import CloseButton from 'common/ui/close-button';

export default function Buttons () {
  return (
    <div>
      <h2>Close Buttons <Monospace variant="small">common/ui/close-button</Monospace></h2>

      <Grid columns={6} width="600px">
        <Text variant={[ 'centered', 'strong' ]}>Variant</Text>
        <Text variant={[ 'centered', 'strong' ]}>Extra Small</Text>
        <Text variant={[ 'centered', 'strong' ]}>Small</Text>
        <Text variant={[ 'centered', 'strong' ]}>Normal</Text>
        <Text variant={[ 'centered', 'strong' ]}>Large</Text>
        <Text variant={[ 'centered', 'strong' ]}>Extra Large</Text>

        <Text variant={[ 'centered', 'monospace' ]}>Default</Text>
        <Grid.Row justify="around">
          <CloseButton size="xs" />
          <CloseButton size="xs" disabled />
        </Grid.Row>
        <Grid.Row justify="around">
          <CloseButton size="sm" />
          <CloseButton size="sm" disabled />
        </Grid.Row>
        <Grid.Row justify="around">
          <CloseButton />
          <CloseButton disabled />
        </Grid.Row>
        <Grid.Row justify="around">
          <CloseButton size="lg" />
          <CloseButton size="lg" disabled />
        </Grid.Row>
        <Grid.Row justify="around">
          <CloseButton size="xl" />
          <CloseButton size="xl" disabled />
        </Grid.Row>

        {CloseButton.VARIANTS.map((v) => (
          <Fragment key={v}>
            <Text variant={[ 'centered', 'monospace' ]}>{v}</Text>
            <Grid.Row justify="around">
              <CloseButton variant={v} size="xs" />
              <CloseButton variant={v} size="xs" disabled />
            </Grid.Row>
            <Grid.Row justify="around">
              <CloseButton variant={v} size="sm" />
              <CloseButton variant={v} size="sm" disabled />
            </Grid.Row>
            <Grid.Row justify="around">
              <CloseButton variant={v} />
              <CloseButton variant={v} disabled />
            </Grid.Row>
            <Grid.Row justify="around">
              <CloseButton variant={v} size="lg" />
              <CloseButton variant={v} size="lg" disabled />
            </Grid.Row>
            <Grid.Row justify="around">
              <CloseButton variant={v} size="xl" />
              <CloseButton variant={v} size="xl" disabled />
            </Grid.Row>
          </Fragment>
        ))}
      </Grid>
    </div>
  );
}
