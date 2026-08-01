import { FolderTableCell as FolderTableCell_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { FolderField as FolderField_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'
import { RowLabel as RowLabel_6f37a237655b801e3a3efe2c447a44e0 } from '@/payload/admin/components/row-label'
import { RscEntryLexicalCell as RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { RscEntryLexicalField as RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { LexicalDiffComponent as LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e } from '@payloadcms/richtext-lexical/rsc'
import { LinkFeatureClient as LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { FixedToolbarFeatureClient as FixedToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864 } from '@payloadcms/richtext-lexical/client'
import { OverviewComponent as OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaImageComponent as MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860 } from '@payloadcms/plugin-seo/client'
import { SlugField as SlugField_2b8867833a34864a02ddf429b0728a40 } from '@payloadcms/next/client'
import { FolderTypeField as FolderTypeField_2b8867833a34864a02ddf429b0728a40 } from '@payloadcms/next/client'
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from '@payloadcms/storage-s3/client'
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from '@payloadcms/next/rsc'

/** @type import('payload').ImportMap */
export const importMap = {
  "@payloadcms/next/rsc#FolderTableCell": FolderTableCell_f9c02e79a4aed9a3924487c0cd4cafb1,
  "@payloadcms/next/rsc#FolderField": FolderField_f9c02e79a4aed9a3924487c0cd4cafb1,
  "@/payload/admin/components/row-label#RowLabel": RowLabel_6f37a237655b801e3a3efe2c447a44e0,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalCell": RscEntryLexicalCell_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#RscEntryLexicalField": RscEntryLexicalField_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/rsc#LexicalDiffComponent": LexicalDiffComponent_44fe37237e0ebf4470c9990d8cb7b07e,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#FixedToolbarFeatureClient": FixedToolbarFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_e70f5e05f09f93e00b997edb1ef0c864,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaImageComponent": MetaImageComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_a8a977ebc872c5d5ea7ee689724c0860,
  "@payloadcms/next/client#SlugField": SlugField_2b8867833a34864a02ddf429b0728a40,
  "@payloadcms/next/client#FolderTypeField": FolderTypeField_2b8867833a34864a02ddf429b0728a40,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler": S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards": CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1
}
