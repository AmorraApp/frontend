const path = require('path');
const Case = require('case');

// This is a custom Jest transformer turning file imports into filenames.
// http://facebook.github.io/jest/docs/en/webpack.html

module.exports = exports = {
  process (src, filename) {
    const assetFilename = JSON.stringify(path.basename(filename));

    if (filename.match(/\.svg$/)) {
      // Based on how SVGR generates a component name:
      // https://github.com/smooth-code/svgr/blob/01b194cf967347d43d4cbe6b434404731b87cf27/packages/core/src/state.js#L6
      const pascalCaseFilename = Case.pascal(path.parse(filename).name);
      const componentName = `Svg${pascalCaseFilename}`;
      return {
        code: `
          import { forwardRef } from 'react';
          export default {
            __esModule: true,
            default: ${assetFilename},
            ReactComponent: forwardRef(function ${componentName}(props, ref) {
              return {
                $$typeof: Symbol.for('react.element'),
                type: 'svg',
                ref: ref,
                key: null,
                props: Object.assign({}, props, {
                  children: ${assetFilename}
                })
              };
            }),
          };
        `,
      };
    }

    return { code: `module.exports = ${assetFilename};` };
  },
};
