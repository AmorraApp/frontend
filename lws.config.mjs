import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default {
  spa: path.resolve(__dirname, 'src/index.html'),
  rewrite: [
    {
      from: '/v1/(.*)',
      to: 'http://127.0.0.1:3000/v1/$1',
    },
  ],
  directory: 'dist',
  logFormat: 'stats',
};
