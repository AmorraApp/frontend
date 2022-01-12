import ListGroup from 'common/ui/list-group';
import Grid from 'common/ui/grid';
import { Monospace } from 'common/ui/text';

export default function ListGroups () {
  return (
    <div>
      <h2>List Groups <Monospace variant="small">common/ui/list-group</Monospace></h2>

      <Grid.Row spaced>

        <Grid.Column fill>
          <ListGroup>
            <ListGroup.Item>Normal Item</ListGroup.Item>
            <ListGroup.Item active>Active</ListGroup.Item>
            <ListGroup.Item disabled>Disabled</ListGroup.Item>
            <ListGroup.Item active disabled>Active Disabled</ListGroup.Item>
            <ListGroup.Item action>Action</ListGroup.Item>
            <ListGroup.Item action active>Action Active</ListGroup.Item>
            <ListGroup.Item action disabled>Action Disabled</ListGroup.Item>
            <ListGroup.Item action active disabled>Action Active Disabled</ListGroup.Item>
          </ListGroup>
        </Grid.Column>

        <Grid.Column fill>
          <ListGroup variant="flush">
            <ListGroup.Item>Cras justo odio</ListGroup.Item>
            <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            <ListGroup.Item>Morbi leo risus</ListGroup.Item>
            <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          </ListGroup>
        </Grid.Column>

        <Grid.Column fill>
          <ListGroup>
            <ListGroup.Item action>No style</ListGroup.Item>
            <ListGroup.Item action variant="primary">Primary</ListGroup.Item>
            <ListGroup.Item action variant="secondary">Secondary</ListGroup.Item>
            <ListGroup.Item action variant="success">Success</ListGroup.Item>
            <ListGroup.Item action variant="danger">Danger</ListGroup.Item>
            <ListGroup.Item action variant="warning">Warning</ListGroup.Item>
            <ListGroup.Item action variant="info">Info</ListGroup.Item>
            <ListGroup.Item action variant="light">Light</ListGroup.Item>
            <ListGroup.Item action variant="dark">Dark</ListGroup.Item>
            <ListGroup.Item action variant="brand">Brand</ListGroup.Item>
          </ListGroup>
        </Grid.Column>
      </Grid.Row>
    </div>
  );
}
