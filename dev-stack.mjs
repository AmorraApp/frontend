/* global process */
/* eslint no-console: 0 */
import LocalWebServer from 'local-web-server'; // eslint-disable-line
import { watch } from 'rollup';
import rollupConfig from './rollup.config.mjs';
import lwsConfig from './lws.config.mjs';

(async () => {

  const watcher = await watch(rollupConfig);
  const ws = await LocalWebServer.create(lwsConfig);

  watcher.on('event', (event) => {
    if (event.result) event.result.close();
    console.log(event.code);
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //                  * event.input will be the input options object if present
    //                  * event.output contains an array of the "file" or
    //                    "dir" option values of the generated outputs
    //   BUNDLE_END   — finished building a bundle
    //                  * event.input will be the input options object if present
    //                  * event.output contains an array of the "file" or
    //                    "dir" option values of the generated outputs
    //                  * event.duration is the build duration in milliseconds
    //                  * event.result contains the bundle object that can be
    //                    used to generate additional outputs by calling
    //                    bundle.generate or bundle.write. This is especially
    //                    important when the watch.skipWrite option is used.
    //                  You should call "event.result.close()" once you are done
    //                  generating outputs, or if you do not generate outputs.
    //                  This will allow plugins to clean up resources via the
    //                  "closeBundle" hook.
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //                  * event.error contains the error that was thrown
    //                  * event.result is null for build errors and contains the
    //                    bundle object for output generation errors. As with
    //                    "BUNDLE_END", you should call "event.result.close()" if
    //                    present once you are done.

    if (event.code === 'ERROR') console.error(event.error.formatted || event.error.message);
  });

  function shutdown () {
    watcher.close();
    ws.server.close();
  }

  process.on('SIGUSR2', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  process.on('uncaughtException', (err) => {
    console.error(err, 'Encountered an unhandled exception error, restarting process');
    process.exit(-1);
  });

})().catch(console.error);
