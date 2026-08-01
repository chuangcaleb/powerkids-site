import * as migration_20260730_134324_initial from './20260730_134324_initial';
import * as migration_20260801_013755 from './20260801_013755';

export const migrations = [
  {
    up: migration_20260730_134324_initial.up,
    down: migration_20260730_134324_initial.down,
    name: '20260730_134324_initial',
  },
  {
    up: migration_20260801_013755.up,
    down: migration_20260801_013755.down,
    name: '20260801_013755'
  },
];
