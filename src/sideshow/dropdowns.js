import DropdownButton from 'common/ui/dropdown/button';
import Grid from 'common/ui/grid';
import { Monospace } from 'common/ui/text';

export default function Dropdowns () {
  return (
    <div>
      <h2>Dropdown Buttons <Monospace variant="small">common/ui/dropdown/button</Monospace></h2>
      <Grid>
        <DropdownButton title="Dropdown">
          <DropdownButton.Item>Action 1</DropdownButton.Item>
          <DropdownButton.Item>Action 2</DropdownButton.Item>
          <DropdownButton.Divider />
          <DropdownButton.Item>Action 3</DropdownButton.Item>
        </DropdownButton>
      </Grid>
    </div>
  );
}
