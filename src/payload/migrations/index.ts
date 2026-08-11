import * as migration_20260730_134324_initial from './20260730_134324_initial'
import * as migration_20260801_013755 from './20260801_013755'
import * as migration_20260801_022536 from './20260801_022536'
import * as migration_20260801_025747 from './20260801_025747'
import * as migration_20260801_033322 from './20260801_033322'
import * as migration_20260801_084504_rename_site_settings_tagline_to_name from './20260801_084504_rename_site_settings_tagline_to_name'
import * as migration_20260801_085558_remove_navigation_header from './20260801_085558_remove_navigation_header'
import * as migration_20260801_094156_add_content_block from './20260801_094156_add_content_block'
import * as migration_20260801_104018_rename_content_column_variant_card_to_image from './20260801_104018_rename_content_column_variant_card_to_image'
import * as migration_20260801_111554_add_pages_autosave from './20260801_111554_add_pages_autosave'
import * as migration_20260810_135829 from './20260810_135829'
import * as migration_20260810_141308_add_programs_icon from './20260810_141308_add_programs_icon'
import * as migration_20260810_143644_add_programs_showcase_block from './20260810_143644_add_programs_showcase_block'
import * as migration_20260810_144801_rename_programs_showcase_to_framed_rows from './20260810_144801_rename_programs_showcase_to_framed_rows'
import * as migration_20260810_150409_add_sunrise_sunset_icon_options from './20260810_150409_add_sunrise_sunset_icon_options'
import * as migration_20260811_224500_add_site_settings_footer_reel from './20260811_224500_add_site_settings_footer_reel'
import * as migration_20260811_230000_drop_programs_events_authored_blocks from './20260811_230000_drop_programs_events_authored_blocks'

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
  {
    up: migration_20260801_094156_add_content_block.up,
    down: migration_20260801_094156_add_content_block.down,
    name: '20260801_094156_add_content_block',
  },
  {
    up: migration_20260801_104018_rename_content_column_variant_card_to_image.up,
    down: migration_20260801_104018_rename_content_column_variant_card_to_image.down,
    name: '20260801_104018_rename_content_column_variant_card_to_image',
  },
  {
    up: migration_20260801_111554_add_pages_autosave.up,
    down: migration_20260801_111554_add_pages_autosave.down,
    name: '20260801_111554_add_pages_autosave',
  },
  {
    up: migration_20260810_135829.up,
    down: migration_20260810_135829.down,
    name: '20260810_135829',
  },
  {
    up: migration_20260810_141308_add_programs_icon.up,
    down: migration_20260810_141308_add_programs_icon.down,
    name: '20260810_141308_add_programs_icon',
  },
  {
    up: migration_20260810_143644_add_programs_showcase_block.up,
    down: migration_20260810_143644_add_programs_showcase_block.down,
    name: '20260810_143644_add_programs_showcase_block',
  },
  {
    up: migration_20260810_144801_rename_programs_showcase_to_framed_rows.up,
    down: migration_20260810_144801_rename_programs_showcase_to_framed_rows.down,
    name: '20260810_144801_rename_programs_showcase_to_framed_rows',
  },
  {
    up: migration_20260810_150409_add_sunrise_sunset_icon_options.up,
    down: migration_20260810_150409_add_sunrise_sunset_icon_options.down,
    name: '20260810_150409_add_sunrise_sunset_icon_options',
  },
  {
    up: migration_20260811_224500_add_site_settings_footer_reel.up,
    down: migration_20260811_224500_add_site_settings_footer_reel.down,
    name: '20260811_224500_add_site_settings_footer_reel',
  },
  {
    up: migration_20260811_230000_drop_programs_events_authored_blocks.up,
    down: migration_20260811_230000_drop_programs_events_authored_blocks.down,
    name: '20260811_230000_drop_programs_events_authored_blocks',
  },
]
