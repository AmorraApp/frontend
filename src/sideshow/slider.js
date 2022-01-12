import Grid from 'common/ui/grid';
import Slider from 'common/ui/slider';
import TextField from 'common/ui/input/TextField';
import { useState } from 'react';
import { Monospace } from 'common/ui/text';

export default function Sliders () {
  const [ state, setState ] = useState([ 20, 60 ]);
  const marks = [
    {
      value: 0,
      label: '0°C',
    },
    {
      value: 20,
      label: '20°C',
    },
    {
      value: 37,
      label: '37°C',
    },
    {
      value: 100,
      label: '100°C',
    },
  ];

  return (
    <div>
      <h2>Slider <Monospace variant="small">common/ui/slider</Monospace></h2>

      <Grid.Row spaced>
        <Slider
          step={5}
          marks={marks}
          value={state}
          onChange={setState}
          focusKey="slider"
        />
        <TextField value={state.join(',')} onChange={(v) => setState(v.split(',').map(Number))} />

      </Grid.Row>

    </div>
  );
}
