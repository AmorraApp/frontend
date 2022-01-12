import QuickState from 'common/quickstate';
import Grid from 'common/ui/grid';
import Kalendae from 'common/ui/kalendae';
import { Monospace } from 'common/ui/text';

import { subDays, addDays } from 'date-fns';

const today = new Date(2020, 11, 30);
const today2 = new Date(2020, 11, 16);

const log = (mo) => console.log('Date Changed', mo); // eslint-disable-line no-console

export default function DatePicker () {
  return (
    <div>
      <h2>Kalendae <Monospace variant="small">common/ui/kalendae</Monospace></h2>

      <h4>Input Picker</h4>
      <Grid spaced columns={2}>
        <QuickState onChange={log}>
          <Kalendae.Input />
        </QuickState>

        <QuickState onChange={log} initial={today}>
          <Kalendae.Input />
        </QuickState>

        <QuickState onChange={log} initial={[ today2, today ]}>
          <Kalendae.Input mode="RANGE" months={2} />
        </QuickState>

        <QuickState onChange={log} initial={[ today2, today ]}>
          <Kalendae.Input mode="MULTIPLE" months={2} />
        </QuickState>
      </Grid>

      <hr />

      <h4>Basic UI Pieces</h4>
      <Grid.Row justify="center">
        <Kalendae className={Grid.fill} months={1} onChange={log} today={today} value={today} />
        <Kalendae className={Grid.fill} months={2} onChange={log} today={today} value={[ subDays(today, 1), addDays(today, 1), addDays(today, 2), addDays(today, 3) ]} mode="multiple" dayHeaderClickable />
      </Grid.Row>
      <Grid.Row justify="center">
        <Kalendae months={3} onChange={log} today={today} value={[ subDays(today, 7), addDays(today, 7) ]} mode="range" />
      </Grid.Row>
      <hr />

      <h4>Directions</h4>
      <Grid.Row justify="center" wrap>
        <Grid.Column>
          <h4>PAST</h4>
          <Kalendae today={today2} direction={Kalendae.DIRECTION.PAST} />
        </Grid.Column>
        <Grid.Column>
          <h4>TODAY_PAST</h4>
          <Kalendae today={today2} direction={Kalendae.DIRECTION.TODAY_PAST} />
        </Grid.Column>
        <Grid.Column>
          <h4>ANY</h4>
          <Kalendae today={today2} direction={Kalendae.DIRECTION.ANY} />
        </Grid.Column>
        <Grid.Column>
          <h4>TODAY_FUTURE</h4>
          <Kalendae today={today2} direction={Kalendae.DIRECTION.TODAY_FUTURE} />
        </Grid.Column>
        <Grid.Column>
          <h4>FUTURE</h4>
          <Kalendae today={today2} direction={Kalendae.DIRECTION.FUTURE} />
        </Grid.Column>
      </Grid.Row>

      <hr />

      <h4>Stated</h4>
      <Grid.Row justify="center">
        <QuickState onChange={log}>
          <Kalendae />
        </QuickState>
      </Grid.Row>

      <hr />

      <h4>Full Year</h4>
      <Grid.Row justify="center">
        <Kalendae months={12} hideNav="month" viewStartDate={new Date(2021, 0, 1)} />
      </Grid.Row>

    </div>
  );
}
