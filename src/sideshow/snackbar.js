
import Snackbar, { SnackbarContent, useSnackbar } from 'common/ui/snackbar';
import { useCallback } from 'react';
import useToggledState from 'common/hooks/useToggledState';
import Grid from 'common/ui/grid';
import { Monospace } from 'common/ui/text';
import Button from 'common/ui/button';
import { Switch } from 'common/ui/input';
import Code from 'common/ui/code';

export default function Snackbars () {
  const {
    state: snackbarOpen,
    toggle: toggleSnackbar,
    off: hideSnackbar,
  } = useToggledState();

  const createSnackbar = useSnackbar();

  return (
    <div>
      <h2>Snackbars <Monospace variant="small">common/ui/snackbar</Monospace></h2>

      <Code>{`
        import { useSnackbar } from 'common/ui/snackbar';
        import Button from 'common/ui/button';

        function SnackbarTrigger {
          const createSnackbar = useSnackbar();
          const showNotification = useCallback(() => {
            createSnackbar({
              message: 'This is a notification!',
            });
          });

          return <Button onClick={showNotification}>Notify</Button>;
        }
      `}</Code>

      <br />

      <h3>Manual Snackbar:</h3>

      <Switch label="Show Snackbar" value={snackbarOpen} onChange={toggleSnackbar} />

      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        message={<strong>I love snacks</strong>}
      />

      <Code>{`
        import Snackbar from 'common/ui/snackbar';
        import { Switch } from 'common/ui/input';
        import useToggledState from 'common/hooks/useToggledState';

        function CustomSnackbar () {
          const {
            state: snackbarOpen,
            toggle: toggleSnackbar,
            off: hideSnackbar,
          } = useToggledState();

          return (
            <Switch label="Show Snackbar" value={snackbarOpen} onChange={toggleSnackbar} />

            <Snackbar
              open={snackbarOpen}
              onClose={hideSnackbar}
              message={<strong>I love snacks</strong>}
            />
          );
        }
      `}</Code>

      <br />

      <h3>Anchors</h3>

      <Grid spaced>
        {Snackbar.ANCHORS.map((anchor) => (
          <Button
            key={anchor}
            onClick={useCallback(() => {
              createSnackbar({
                anchor,
                message: 'I am positioned ' + anchor,
              });
            })}
          >{anchor}</Button>
        ))}
      </Grid>

      <br />

      <h3>Snackbar Variants</h3>

      <Grid.Column spaced>
        <SnackbarContent
          message="Default"
          closable
        />
        {Snackbar.VARIANTS.map((v) => (
          <SnackbarContent
            key={v}
            message={"Variant: " + v}
            variant={v}
            closable
          />
        ))}
      </Grid.Column>

    </div>
  );
}
