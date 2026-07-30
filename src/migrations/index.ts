import * as migration_20260730_134324_initial from './20260730_134324_initial';

export const migrations = [
  {
    up: migration_20260730_134324_initial.up,
    down: migration_20260730_134324_initial.down,
    name: '20260730_134324_initial'
  },
];
