import { Fragment } from 'react';
import ProgressBar from 'common/ui/progress-bar';
import Grid from 'common/ui/grid';
import Text, { Monospace } from 'common/ui/text';
import useClock from 'common/hooks/useClock';
import useIncrementer from 'common/hooks/useIncrementer';


export default function ProgressBars () {
  const MAX = 10;
  const timer = useClock(useClock.INTERVAL_SECONDS(2));
  const tick = useIncrementer(timer);
  const now = ((tick % 5) * 2) + 2;

  return (
    <div>
      <h2>Progress Bars <Monospace variant="small">common/ui/progress-bar</Monospace></h2>

      <Grid columns={3} spaced>
        <ProgressBar />
        <ProgressBar now={50} />
        <ProgressBar now={100} />
      </Grid>

      <br />

      <h3>Transitions</h3>

      <Grid columns={3} spaced>
        <ProgressBar max={MAX} now={now} />
        <ProgressBar max={MAX} now={now} striped />
        <ProgressBar max={MAX} now={now} animated />
      </Grid>

      <br />

      <h3>Stacked</h3>

      <Grid.Column spaced>

        <ProgressBar max={MAX} size="sm">
          <ProgressBar now={4} />
          <ProgressBar now={1} variant="warning" />
          <ProgressBar now={2} variant="danger" animated />
        </ProgressBar>

        <ProgressBar max={MAX}>
          <ProgressBar now={4} />
          <ProgressBar now={1} variant="warning" />
          <ProgressBar now={2} variant="danger" animated />
        </ProgressBar>

        <ProgressBar max={MAX} size="lg">
          <ProgressBar now={4} />
          <ProgressBar now={1} variant="warning" />
          <ProgressBar now={2} variant="danger" animated />
        </ProgressBar>
      </Grid.Column>

      <h3>Variants</h3>

      <Grid columns={4} spaced>
        <Text variant={[ 'centered', 'strong' ]}>Variant</Text>
        <Text variant={[ 'centered', 'strong' ]}>Normal</Text>
        <Text variant={[ 'centered', 'strong' ]}>Striped</Text>
        <Text variant={[ 'centered', 'strong' ]}>Animated</Text>

        <Text variant={[ 'centered', 'monospace' ]}>Default</Text>
        <div><ProgressBar max={MAX} now={MAX * 0.75} /></div>
        <div><ProgressBar max={MAX} now={MAX * 0.75} striped /></div>
        <div><ProgressBar max={MAX} now={MAX * 0.75} animated /></div>

        {ProgressBar.VARIANTS.map((v) => (
          <Fragment key={v}>
            <Text variant={[ 'centered', 'monospace' ]}>{v}</Text>
            <div><ProgressBar max={MAX} now={MAX * 0.75} variant={v} /></div>
            <div><ProgressBar max={MAX} now={MAX * 0.75} variant={v} striped /></div>
            <div><ProgressBar max={MAX} now={MAX * 0.75} variant={v} animated /></div>
          </Fragment>
        ))};
      </Grid>
    </div>
  );
}
