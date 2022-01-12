
import {
  Checkbox,
  Disclosure,
  Control,
  Radio,
  Switch,
  File,
  TextField,
  TextArea,
  Range,
  Numeric,
  Label,
  InputGroup,
  Toggle,
  Labelable,
} from 'common/ui/input';
import Grid from 'common/ui/grid';
import Cell from 'common/ui/cell';
import QuickState from 'common/quickstate';
import { Monospace } from 'common/ui/text';

export default function Inputs () {
  return (
    <div>
      <h2>Inputs <Monospace variant="small">common/ui/input</Monospace></h2>

      <Cell>
        <h4>Text Fields and Labelables</h4>

        <Grid.Row spaced>
          <Labelable as={Grid.Column}>
            <Label nowrap>Email Field</Label>
            <TextField type="email" placeholder="Enter email" />
          </Labelable>

          <Labelable as={Grid.Column}>
            <Label nowrap>Password Field</Label>
            <TextField type="password" placeholder="Enter password" />
          </Labelable>
        </Grid.Row>
      </Cell>

      <Cell>
        <h4>Numeric Field</h4>
        <QuickState initial={0}>
          <Numeric />
        </QuickState>
      </Cell>

      <Cell>
        <h4>Text Area</h4>
        <Grid.Row spaced>
          <Grid.Column fill>
            <Label>Fixed Height</Label>
            <QuickState>
              <TextArea rows={3} />
            </QuickState>
          </Grid.Column>
          <Grid.Column fill>
            <Label>Flexible Height</Label>
            <QuickState>
              <TextArea grow />
            </QuickState>
          </Grid.Column>
        </Grid.Row>
      </Cell>

      <Cell>
        <h4>Control Container</h4>

        <Grid.Row spaced>
          <Control>
            You can put anything in here.
          </Control>

          <Control focusable>
            This one is focusable.
          </Control>

          <Control disabled>
            This one is disabled.
          </Control>
        </Grid.Row>
      </Cell>

      <Cell>
        <h4>Native Checkboxes</h4>
        <Grid.Column spaced>
          <Checkbox label="Normal Checkbox" />
          <Checkbox label="Custom Checkbox" custom />
          <Checkbox label={<strong>Checkbox With Component Label</strong>} />
          <Checkbox label="Indeterminate Checkbox" indeterminate />
        </Grid.Column>
      </Cell>

      <Cell>
        <h4>&quot;Native&quot; Disclosures</h4>
        <Grid.Column spaced>
          <Disclosure right label="Disclosure Right" />
          <Disclosure left label="Disclosure Left" />
          <Disclosure label="Disclosure Disabled" disabled />
        </Grid.Column>
      </Cell>

      <Cell>
        <h4>Radio Buttons</h4>
        <Radio.Group as={Grid}>
          <span><Radio label="Value A" /></span>
          <span><Radio label="Value B" /></span>
          <span><Radio label="Custom A" custom /></span>
          <span><Radio label="Custom B" custom /></span>
          <span><Radio label={<strong>Radio With Component Label</strong>} /></span>
          <span><Radio label="Disabled" disabled /></span>
        </Radio.Group>
      </Cell>

      <Cell>
        <h4>Switches</h4>
        <Grid.Row spaced>
          <Grid.Column justify="center">
            <Label nowrap>Switch Small</Label>
            <Switch size="sm" />
          </Grid.Column>
          <Grid.Column justify="center">
            <Label nowrap>Switch Regular</Label>
            <Switch />
          </Grid.Column>
          <Grid.Column justify="center">
            <Label nowrap>Switch Large</Label>
            <Switch size="lg" />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row spaced>
          <Grid.Column justify="center">
            <Label nowrap>Switch Disabled Off</Label>
            <Switch disabled />
          </Grid.Column>
          <Grid.Column justify="center">
            <Label nowrap>Switch Disabled On</Label>
            <Switch disabled value />
          </Grid.Column>
          <Grid.Column justify="center">
            <Label nowrap>Switch Indeterminate Off</Label>
            <Switch indeterminate />
          </Grid.Column>
          <Grid.Column justify="center">
            <Label nowrap>Switch Indeterminate On</Label>
            <Switch indeterminate value />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row wrap spaced>
          {Switch.VARIANTS.map((v) => (
            <QuickState initial key={v}><Switch variant={v} label={v} /></QuickState>
          ))}
        </Grid.Row>
      </Cell>

      <Cell>
        <h4>Range Slider</h4>
        <Grid.Column>
          <Label nowrap>Range Control</Label>
          <Range />
        </Grid.Column>
        <Grid.Column>
          <Label nowrap>Custom Range Control</Label>
          <Range custom />
        </Grid.Column>
      </Cell>


      <Cell>
        <h4>Input Groups</h4>
        <Grid.Row spaced>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Prepend</InputGroup.Text>
            </InputGroup.Prepend>
            <TextField
              placeholder="Placeholder"
              aria-label="Placeholder"
            />
            <TextField
              placeholder="Placeholder"
              aria-label="Placeholder"
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon1">Append</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Grid.Row>
      </Cell>

      <Cell>
        <h4>File Input</h4>
        <File />
      </Cell>

      <Cell>
        <h4>Toggles</h4>
        <Toggle type="radio" defaultValue={1}>
          <Toggle.Button value={1}>Toggled Option 1</Toggle.Button>
          <Toggle.Button value={2}>Option 2</Toggle.Button>
        </Toggle>
      </Cell>
    </div>
  );
}
