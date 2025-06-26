import type { Loader } from "astro/loaders";
import { defineCollection, z } from "astro:content";


function loader(): Loader {
    return {
        name: 'deno-deploy-loader',
        load: async (context) => {
            const { result, error } = await (await fetch('https://polite-pig-54.deno.dev/users')).json()
            if (error !== '') context.logger.error(error);
            for (const [user, userid] of Object.entries(result)) {
                console.log({ user, userid });
                try {
                    const { result, error } = await (await fetch('https://polite-pig-54.deno.dev/api?user='+user)).json();
                    
                    if (error !== '') context.logger.error(error);
    
                    for (const [workid, records] of Object.entries<any>(result)) {
                        const data = {
                            user: userid,
                            title: records.title,
                            fandom: records.fandom,
                            rating: records.rating,
                            warnings: records.warnings,
                            category: records.category,
                            records: {}
                        }
                        delete records.title;
                        delete records.fandom;
                        delete records.rating;
                        delete records.warnings
                        delete records.category
                        data.records = records;
                        // const title = records[0].title;
                        context.store.set({
                            id: workid,
                            data
                        })
                    }
                } catch(e: any) {
                    context.logger.error(e.message)
                }
            }
            
            /*

            const results = await fetch('https://polite-pig-54.deno.dev/api');
            const data = await results.json();
            
            

            for (const [id, records] of Object.entries(data)) {
                context.store.set({
                    id,
                    // @ts-ignore
                    data: records
                })
            }
                */
        }
    }
}

export const collections = {
    analytics: defineCollection({
        loader: loader()
    }),
    users: defineCollection({
        loader: {
            name: 'deno-user-loader',
            load: async (context) => {
                const results = await fetch('https://polite-pig-54.deno.dev/users');
                const data = await results.json();
                for (const [user, id] of Object.entries<string>(data.result)) {
                    context.store.set({
                        id: ''+id,
                        data: { user }
                    })
                }
            }
        },
        schema: z.object({
            user: z.string()
        })
    })
}