/* THIS FILE IS PART OF PAYLOAD'S REQUIRED APP ROUTER INTEGRATION.
 * The admin panel renders inside this route group, isolated from the public
 * site's layout so its styles and providers do not leak either way. */
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './admin/importMap.js'
import React from 'react'

import '@payloadcms/next/css'
// Colour tokens only — the admin's own CSS doesn't define --accent-red etc.,
// but the mascot graphic (Logo/Icon) reads them.
import '@/styles/tokens/colour.css'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({ ...args, config, importMap })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
