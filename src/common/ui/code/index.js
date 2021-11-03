
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import codeStyle from './codestyle';
import { stripIndent } from 'common/utils';

SyntaxHighlighter.registerLanguage('jsx', jsx);

const Code = forwardRef(({
  children,
  style,
  language = 'jsx',
}, ref) => (
  <SyntaxHighlighter
    ref={ref}
    customStyle={style}
    language={language}
    style={codeStyle}
  >
    {stripIndent(children).trim()}
  </SyntaxHighlighter>
));
Code.displayName = 'Code';
Code.propTypes = {
  children: PropTypes.string,
  language: PropTypes.string,
};

export default Code;
