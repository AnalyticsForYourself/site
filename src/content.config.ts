import type { Loader } from "astro/loaders";
import { defineCollection } from "astro:content";


function loader(): Loader {
    return {
        name: 'deno-deploy-loader',
        load: async (context) => {
            const results = await fetch('https://polite-pig-54.deno.dev/api');
            const data = await results.json();
            
            for (const [id, records] of Object.entries(data)) {
                context.store.set({
                    id,
                    // @ts-ignore
                    data: records
                })
            }
        }
    }
}

export const collections = {
    analytics: defineCollection({
        loader: loader()
    })
}