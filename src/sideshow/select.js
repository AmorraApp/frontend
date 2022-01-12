import Grid from 'common/ui/grid';
import Select from 'common/ui/select';
import STATES from 'common/constants/states';
import { Monospace } from 'common/ui/text';

export default function Selects () {
  return (
    <div>
      <h2>Drop Select <Monospace variant="small">common/ui/select</Monospace></h2>

      <Grid.Row spaced>
        <Grid.Column fill>
          <strong>Single</strong>
          <Select
            options={STATES}
          />
        </Grid.Column>

        <Grid.Column fill>
          <strong>Multiple</strong>
          <Select
            options={STATES}
            multiple
          />
        </Grid.Column>

      </Grid.Row>

    </div>
  );
}
