
const IGNORES = [
  'privacy',
];

export default function ({ attributes, bundle, meta, files, publicPath }) {
  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    });

  const scripts = [];
  for (const file of (files.js || [])) {
    const originalName = bundle[file.fileName].name;
    if (IGNORES.includes(originalName)) continue;

    const attrs = makeHtmlAttributes(attributes.script);
    if (file.isEntry) {
      scripts.push(`<script src="${publicPath}${file.fileName}"${attrs}></script>`);
    } else {
      links.push(`<link rel="modulepreload" href="${publicPath}${file.fileName}"${attrs}>`);
    }
  }

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    });

  return `
<!DOCTYPE html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    ${metas.join('\n')}
    <title>nFinus</title>
    ${links.join('\n')}
  </head>
  <body>
    ${scripts.join('\n')}
  </body>
</html>
  `;
}

function makeHtmlAttributes (attributes) {
  if (!attributes) {
    return '';
  }

  const keys = Object.keys(attributes);
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
}
