import Popover from 'common/ui/popover';
import Button from 'common/ui/button';
import Grid from 'common/ui/grid';
import { TextField } from 'common/ui/input';
import { Monospace } from 'common/ui/text';

export default function Popovers () {
  return (
    <div>
      <h2>Popovers <Monospace variant="small">common/ui/popover</Monospace></h2>

      <Grid.Row spaced>
        <Popover.Trigger
          trigger="click"
          placement="bottom"
          overlay={
            <Popover>
              <Popover.Title as="h3">Popover Bottom</Popover.Title>
              <Popover.Content>
                <strong>Holy guacamole!</strong> Check this info.
              </Popover.Content>
            </Popover>
          }
        >
          <Button>Popover on bottom</Button>
        </Popover.Trigger>

        <Popover.Inline placement="right" trigger="click">
          <Button>Popover on Right</Button>
          <Popover.Title as="h3">Popover Right</Popover.Title>
          <Popover.Content>
            <strong>Holy guacamole!</strong> Check this info.
          </Popover.Content>
        </Popover.Inline>

        <Popover.Inline placement="top" trigger="hover">
          <Button>Popover Top on Hover</Button>
          <Popover.Title as="h3">Popover Top on Hover</Popover.Title>
          <Popover.Content>
            <strong>Holy guacamole!</strong> Check this info.
          </Popover.Content>
        </Popover.Inline>

        <Popover.Inline placement="left" trigger="focus">
          <TextField placeholder="Popover Left on Focus" />
          <Popover.Title as="h3">Popover Left on Focus</Popover.Title>
          <Popover.Content>
            <strong>Holy guacamole!</strong> Check this info.
          </Popover.Content>
        </Popover.Inline>

      </Grid.Row>

    </div>
  );
}
