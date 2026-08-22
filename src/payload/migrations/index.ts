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
import * as migration_20260812_095422 from './20260812_095422'
import * as migration_20260812_105031 from './20260812_105031'
import * as migration_20260812_115743 from './20260812_115743'
import * as migration_20260812_123000_rename_header_subheading_to_lead from './20260812_123000_rename_header_subheading_to_lead'
import * as migration_20260812_130000_framed_rows_body_richtext from './20260812_130000_framed_rows_body_richtext'
import * as migration_20260812_132906_drop_site_settings_name from './20260812_132906_drop_site_settings_name'
import * as migration_20260812_154503_add_cta_global from './20260812_154503_add_cta_global'
import * as migration_20260812_160707_drop_steps_contact_cta_banner_blocks from './20260812_160707_drop_steps_contact_cta_banner_blocks'
import * as migration_20260815_145533_add_scrapbook_block from './20260815_145533_add_scrapbook_block'
import * as migration_20260816_081710_add_scrapbook_seed from './20260816_081710_add_scrapbook_seed'
import * as migration_20260816_091026_drop_site_settings_footer_reel from './20260816_091026_drop_site_settings_footer_reel'
import * as migration_20260817_130357 from './20260817_130357'
import * as migration_20260817_143448 from './20260817_143448'
import * as migration_20260817_154407 from './20260817_154407'
import * as migration_20260817_160000_drop_legacy_doodle_icon_tables from './20260817_160000_drop_legacy_doodle_icon_tables'
import * as migration_20260818_183000_rename_doodle_icons_to_icons from './20260818_183000_rename_doodle_icons_to_icons'
import * as migration_20260819_125503_drop_card_grid_block from './20260819_125503_drop_card_grid_block'
import * as migration_20260822_023226_remove_founded_year from './20260822_023226_remove_founded_year'
import * as migration_20260822_072756_drop_media_caption from './20260822_072756_drop_media_caption'
import * as migration_20260822_120000_media_duplicate_review_by_checksum_group from './20260822_120000_media_duplicate_review_by_checksum_group'

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
  {
    up: migration_20260812_095422.up,
    down: migration_20260812_095422.down,
    name: '20260812_095422',
  },
  {
    up: migration_20260812_105031.up,
    down: migration_20260812_105031.down,
    name: '20260812_105031',
  },
  {
    up: migration_20260812_115743.up,
    down: migration_20260812_115743.down,
    name: '20260812_115743',
  },
  {
    up: migration_20260812_123000_rename_header_subheading_to_lead.up,
    down: migration_20260812_123000_rename_header_subheading_to_lead.down,
    name: '20260812_123000_rename_header_subheading_to_lead',
  },
  {
    up: migration_20260812_130000_framed_rows_body_richtext.up,
    down: migration_20260812_130000_framed_rows_body_richtext.down,
    name: '20260812_130000_framed_rows_body_richtext',
  },
  {
    up: migration_20260812_132906_drop_site_settings_name.up,
    down: migration_20260812_132906_drop_site_settings_name.down,
    name: '20260812_132906_drop_site_settings_name',
  },
  {
    up: migration_20260812_154503_add_cta_global.up,
    down: migration_20260812_154503_add_cta_global.down,
    name: '20260812_154503_add_cta_global',
  },
  {
    up: migration_20260812_160707_drop_steps_contact_cta_banner_blocks.up,
    down: migration_20260812_160707_drop_steps_contact_cta_banner_blocks.down,
    name: '20260812_160707_drop_steps_contact_cta_banner_blocks',
  },
  {
    up: migration_20260815_145533_add_scrapbook_block.up,
    down: migration_20260815_145533_add_scrapbook_block.down,
    name: '20260815_145533_add_scrapbook_block',
  },
  {
    up: migration_20260816_081710_add_scrapbook_seed.up,
    down: migration_20260816_081710_add_scrapbook_seed.down,
    name: '20260816_081710_add_scrapbook_seed',
  },
  {
    up: migration_20260816_091026_drop_site_settings_footer_reel.up,
    down: migration_20260816_091026_drop_site_settings_footer_reel.down,
    name: '20260816_091026_drop_site_settings_footer_reel',
  },
  {
    up: migration_20260817_130357.up,
    down: migration_20260817_130357.down,
    name: '20260817_130357',
  },
  {
    up: migration_20260817_143448.up,
    down: migration_20260817_143448.down,
    name: '20260817_143448',
  },
  {
    up: migration_20260817_154407.up,
    down: migration_20260817_154407.down,
    name: '20260817_154407',
  },
  {
    up: migration_20260817_160000_drop_legacy_doodle_icon_tables.up,
    down: migration_20260817_160000_drop_legacy_doodle_icon_tables.down,
    name: '20260817_160000_drop_legacy_doodle_icon_tables',
  },
  {
    up: migration_20260818_183000_rename_doodle_icons_to_icons.up,
    down: migration_20260818_183000_rename_doodle_icons_to_icons.down,
    name: '20260818_183000_rename_doodle_icons_to_icons',
  },
  {
    up: migration_20260819_125503_drop_card_grid_block.up,
    down: migration_20260819_125503_drop_card_grid_block.down,
    name: '20260819_125503_drop_card_grid_block',
  },
  {
    up: migration_20260822_023226_remove_founded_year.up,
    down: migration_20260822_023226_remove_founded_year.down,
    name: '20260822_023226_remove_founded_year',
  },
  {
    up: migration_20260822_072756_drop_media_caption.up,
    down: migration_20260822_072756_drop_media_caption.down,
    name: '20260822_072756_drop_media_caption',
  },
  {
    up: migration_20260822_120000_media_duplicate_review_by_checksum_group.up,
    down: migration_20260822_120000_media_duplicate_review_by_checksum_group.down,
    name: '20260822_120000_media_duplicate_review_by_checksum_group',
  },
]
