import * as migration_20260730_134324_initial from './20260730_134324_initial'
import * as migration_20260801_013755 from './20260801_013755'
import * as migration_20260801_022536 from './20260801_022536'
import * as migration_20260801_025747 from './20260801_025747'
import * as migration_20260801_033322 from './20260801_033322'
import * as migration_20260801_084504_rename_site_settings_tagline_to_name from './20260801_084504_rename_site_settings_tagline_to_name'
import * as migration_20260801_085558_remove_navigation_header from './20260801_085558_remove_navigation_header'

export const migrations = [
  {
    up: migration_20260730_134324_initial.up,
    down: migration_20260730_134324_initial.down,
    name: '20260730_134324_initial',
  },
  {
    up: migration_20260801_013755.up,
    down: migration_20260801_013755.down,
    name: '20260801_013755',
  },
  {
    up: migration_20260801_022536.up,
    down: migration_20260801_022536.down,
    name: '20260801_022536',
  },
  {
    up: migration_20260801_025747.up,
    down: migration_20260801_025747.down,
    name: '20260801_025747',
  },
  {
    up: migration_20260801_033322.up,
    down: migration_20260801_033322.down,
    name: '20260801_033322',
  },
  {
    up: migration_20260801_084504_rename_site_settings_tagline_to_name.up,
    down: migration_20260801_084504_rename_site_settings_tagline_to_name.down,
    name: '20260801_084504_rename_site_settings_tagline_to_name',
  },
  {
    up: migration_20260801_085558_remove_navigation_header.up,
    down: migration_20260801_085558_remove_navigation_header.down,
    name: '20260801_085558_remove_navigation_header',
  },
]
