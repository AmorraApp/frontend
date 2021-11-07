/* global process */

import fs from 'fs/promises';
import { parse } from "dotenv";

export default async function load () {

  const ENV = process.env.NODE_ENV || 'development';

  const files = [
    '.env',
    '.env.local',
    `.env.${ENV}`,
    `.env.${ENV}.local`,
  ];

  const contents = (await Promise.all(files.map((envFile) => fs.readFile(envFile).then(parse, () => null)))).filter(Boolean);
  const results = Object.assign({}, ...contents );

  const vars = Object.entries(results).map(([ key, value ]) => [ `process.env.${key}`, JSON.stringify(value) ]);

  return Object.fromEntries(vars);
}
