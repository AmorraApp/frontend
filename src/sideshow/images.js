import Grid from 'common/ui/grid';
import { Monospace } from 'common/ui/text';
import Turntable from 'common/ui/image-turntable';
import Image from 'common/ui/image';
import Code from 'common/ui/code';
import { Switch } from 'common/ui/input';
import Lightbox from 'common/ui/lightbox';
import useToggledState from 'common/hooks/useToggledState';


const images = [
  { src: 'http://placeimg.com/100/50/any',    href: 'http://placeimg.com/1000/500/any',  width: 100, height: 50,  ratio: '100-50' },
  { src: 'http://placeimg.com/100/400/any',   href: 'http://placeimg.com/1000/4000/any', width: 100, height: 400, ratio: '100-400' },
  { src: 'http://placeimg.com/100/200/any',   href: 'http://placeimg.com/1000/2000/any', width: 100, height: 200, ratio: '100x200' },
  { src: 'http://placeimg.com/200/200/any',   href: 'http://placeimg.com/2000/2000/any', width: 200, height: 200, ratio: '200:200' },
  { src: 'http://placeimg.com/400/200/any',   href: 'http://placeimg.com/2000/1000/any', width: 400, height: 200, ratio: '400.200' },
  { src: 'http://placeimg.com/600/200/any',   href: 'http://placeimg.com/960/320/any',   width: 600, height: 200, ratio: '600/200' },
];

export default function Grids () {

  const {
    state: lightboxOpen,
    toggle: toggleLightbox,
    off: hideLightbox,
  } = useToggledState();

  return (
    <div>
      <h2>Image Handling</h2>

      <h3>Image <Monospace variant="small">common/ui/image</Monospace></h3>

      <Grid columns={6} spaced>
        <Grid.Column justify="center">
          <strong>Default</strong>
          <Image src="http://placeimg.com/100/100/tech" />
        </Grid.Column>

        <Grid.Column justify="center">
          <strong>Thumbnail</strong>
          <Image src="http://placeimg.com/100/100/tech" thumbnail />
        </Grid.Column>

        <Grid.Column justify="center">
          <strong>Rounded</strong>
          <Image src="http://placeimg.com/100/100/tech" rounded />
        </Grid.Column>

        {Image.ROUNDED.map((v) => v !== true && (
          <Grid.Column key={v} justify="center">
            <strong>Rounded: {v}</strong>
            <Image src="http://placeimg.com/140/100/tech" rounded={v} />
          </Grid.Column>
        ))}
      </Grid>
      <br />
      <strong>Placeholder Image</strong>
      <Grid columns={6} spaced>
        <Grid.Column justify="center">
          <Image placeholder width={100} height={100} />
        </Grid.Column>

        {Image.THEMES.map((v) => v !== true && (
          <Grid.Column key={v} justify="center">
            <Image placeholder width={100} height={100} theme={v} caption={v} />
          </Grid.Column>
        ))}
      </Grid>

      <hr />

      <h3>Turntable <Monospace variant="small">common/ui/image-turntable</Monospace></h3>

      <Turntable images={images} />

      <Code>{`
        import Turntable from 'common/ui/turntable';

        function CustomSnackbar () {
          return (
            <Turntable>
              <img src="/path/to/thumbnail" href="/path/to/fullsize" />
              <img src="/path/to/thumbnail" href="/path/to/fullsize" />
              <img src="/path/to/fullsize" />
              {/* Alternatively, you can also pass an array of objects on the images attribute. */}
            </Turntable>
          );
        }
      `}</Code>

      <hr />

      <h3>Lightbox <Monospace variant="small">common/ui/lightbox</Monospace></h3>

      <Switch label="Show Lightbox" value={lightboxOpen} onChange={toggleLightbox} />

      <Lightbox
        show={lightboxOpen}
        onHide={hideLightbox}
        src="http://placeimg.com/960/320/animals"
      />

      <Code>{`
        import Lightbox from 'common/ui/lightbox';
        import { Switch } from 'common/ui/input';
        import useToggledState from 'common/hooks/useToggledState';

        function CustomLightbox () {
          const {
            state: lightboxOpen,
            toggle: toggleLightbox,
            off: hideLightbox,
          } = useToggledState();

          return (
            <Switch label="Show Lightbox" value={lightboxOpen} onChange={toggleLightbox} />

            <Lightbox
              show={lightboxOpen}
              onHide={hideLightbox}
              src="http://placeimg.com/960/320/animals"
            />
          );
        }
      `}</Code>
    </div>
  );
}
