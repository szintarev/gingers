import * as migration_20260405_020145 from './20260405_020145';

export const migrations = [
  {
    up: migration_20260405_020145.up,
    down: migration_20260405_020145.down,
    name: '20260405_020145'
  },
];
