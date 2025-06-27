// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import clerk from '@clerk/astro';

import netlify from '@astrojs/netlify';

import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
    integrations: [clerk(), icon()],
    output: 'server',
    adapter: netlify(),
    experimental: {
        fonts: [
            {
                name: 'Young Serif', 
                cssVariable: '--young-serif', 
                provider: "local",
                fallbacks: ['serif'],
                variants: [
                    { weight: 500, style: 'normal', src: ['./src/fonts/youngserif/youngserif-regular.woff'], display: 'swap' }
                ]
            }
        ]
    }
});