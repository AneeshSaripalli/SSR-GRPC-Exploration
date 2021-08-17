import { Client } from "cassandra-driver";
import { v4 } from "uuid";

const createKeyspace = `CREATE KEYSPACE IF NOT EXISTS inventory \ 
                            WITH REPLICATION = { \
                                'class' : 'SimpleStrategy', \ 
                                'replication_factor': 1 \ 
                            };`;
const createTable = `CREATE TABLE IF NOT EXISTS inventory.main ( \
                                    id UUID PRIMARY KEY,
                                    name text,
                                    description text,
                                    quantity int,
                                    last_updated timestamp
                                );`;

export async function emulate_activity(client: Client) {
  await client
    .execute(createKeyspace)
    .then((value) => {
      console.log("Success ", value);
    })
    .catch((err) => {
      console.error("Unable to create index 'testing'", err);
    });

  await client.execute(createTable);

  await client.execute(
    "INSERT INTO inventory.main (id, name, description, quantity, last_updated) VALUES (?, ?, ?, ?, ?)",
    [v4(), "fake item", "some item description", 100, Date.now()],
    {
      prepare: true,
    }
  );

  return;
}
