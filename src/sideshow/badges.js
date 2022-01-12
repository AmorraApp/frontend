import Badge from 'common/ui/badge';
import Grid from 'common/ui/grid';
import { Fragment } from 'react';
import Text, { Monospace } from 'common/ui/text';

export default function Badges () {
  return (
    <div>
      <h2>Badges <Monospace variant="small">common/ui/badge</Monospace></h2>
      <Grid columns={[ '100px', 1, 1, 1 ]}>
        <Text variant={[ 'centered', 'strong' ]}>Variant</Text>
        <Text variant={[ 'centered', 'strong' ]}>Small</Text>
        <Text variant={[ 'centered', 'strong' ]}>Normal</Text>
        <Text variant={[ 'centered', 'strong' ]}>Large</Text>

        <Text variant={[ 'centered', 'monospace' ]}>Default</Text>

        <Grid.Row spaced wrap justify="center">
          <Badge size="sm">Default</Badge>
          <Badge size="sm" pill>Pill</Badge>
          <Badge size="sm" disabled>Disabled</Badge>
          <Badge size="sm" closable>Closable</Badge>
          <Badge size="sm" closable disabled>Closable Disabled</Badge>
        </Grid.Row>
        <Grid.Row spaced wrap justify="center">
          <Badge>Default</Badge>
          <Badge pill>Pill</Badge>
          <Badge disabled>Disabled</Badge>
          <Badge closable>Closable</Badge>
          <Badge closable disabled>Closable Disabled</Badge>
        </Grid.Row>
        <Grid.Row spaced wrap justify="center">
          <Badge size="lg">Default</Badge>
          <Badge size="lg" pill>Pill</Badge>
          <Badge size="lg" disabled>Disabled</Badge>
          <Badge size="lg" closable>Closable</Badge>
          <Badge size="lg" closable disabled>Closable Disabled</Badge>
        </Grid.Row>

        {Badge.VARIANTS.map((v) => (
          <Fragment key={v}>
            <Text variant={[ 'centered', 'monospace' ]}>{v}</Text>

            <Grid.Row spaced wrap justify="center">
              <Badge variant={v} size="sm">Default</Badge>
              <Badge variant={v} size="sm" pill>Pill</Badge>
              <Badge variant={v} size="sm" disabled>Disabled</Badge>
              <Badge variant={v} size="sm" closable>Closable</Badge>
              <Badge variant={v} size="sm" closable disabled>Closable Disabled</Badge>
            </Grid.Row>
            <Grid.Row spaced wrap justify="center">
              <Badge variant={v}>Default</Badge>
              <Badge variant={v} pill>Pill</Badge>
              <Badge variant={v} disabled>Disabled</Badge>
              <Badge variant={v} closable>Closable</Badge>
              <Badge variant={v} closable disabled>Closable Disabled</Badge>
            </Grid.Row>
            <Grid.Row spaced wrap justify="center">
              <Badge variant={v} size="lg">Default</Badge>
              <Badge variant={v} size="lg" pill>Pill</Badge>
              <Badge variant={v} size="lg" disabled>Disabled</Badge>
              <Badge variant={v} size="lg" closable>Closable</Badge>
              <Badge variant={v} size="lg" closable disabled>Closable Disabled</Badge>
            </Grid.Row>
          </Fragment>
        ))}
      </Grid>
    </div>
  );
}
