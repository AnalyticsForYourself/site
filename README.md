# TODO

- [ ] Make loader generate multiple collections
```ts
async function createUserCollections() {
    const result = await fetch('users.json')
    const users = await result.json();

    const loaders = {
        users: {
            // load user ids into a collection for referencing
        }
    };
    for (const user of users) {
        loaders[user] = {
            // create a loader tied to each user id
            // that stores all their records
            name: `user-${user}-loader`,
            load: async (context) => {
                const works = await fetch('api.json?user='+user);
                for (const work of works) {
                    context.store.set(work);
                }
            }
        }
    }

    return loaders;
}
export const collections = { ...createUserCollections }
```