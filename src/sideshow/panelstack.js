import Grid from 'common/ui/grid';
import PanelStack, { createPanel, PanelButton, PanelHeader } from 'common/ui/panelstack';
import { Monospace } from 'common/ui/text';


export default function PanelStacks () {
  return (
    <div>
      <h2>PanelStack <Monospace variant="small">common/ui/pagination</Monospace></h2>

      <PanelStack variant="floating">
        <TestPanel panelKey="root" />
      </PanelStack>
    </div>
  );
}

const TestPanel = createPanel(({
  panel,
}) => {

  const panelKey = panel.key;

  return (
    <>
      <PanelHeader>Panel {panelKey}</PanelHeader>
      <Grid.Column spaced width={300}>
        This is a test panel.

        <textarea style={{ display: 'block', height: 200, width: '100%' }} value={JSON.stringify(panel, null, 2)} onChange={() => null} />

        <PanelButton panelKey={panelKey + '-a'}>
          Open A
        </PanelButton>
        <PanelButton panelKey={panelKey + '-b'}>
          Open B
        </PanelButton>

        <TestPanel panelKey={panelKey + '-a'} />
        <TestPanel panelKey={panelKey + '-b'} />
      </Grid.Column>
    </>
  );
});
TestPanel.displayName = 'TestPanel';
