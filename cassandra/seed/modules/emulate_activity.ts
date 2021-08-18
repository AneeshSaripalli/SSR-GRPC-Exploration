import { Client } from "cassandra-driver";
import { v4 } from "uuid";
import faker from "faker";

const createKeyspace = `CREATE KEYSPACE IF NOT EXISTS inventory \ 
                            WITH REPLICATION = { \
                                'class' : 'SimpleStrategy', \ 
                                'replication_factor': 2 \ 
                            };`;
const createTable = `CREATE TABLE IF NOT EXISTS inventory.main ( \
                                    id UUID PRIMARY KEY,
                                    name text,
                                    description text,
                                    quantity int,
                                    last_updated timestamp
                                );`;

async function createItems(client: Client): Promise<string> {
  const id = v4();
  await client.execute(
    "INSERT INTO inventory.main (id, name, description, quantity, last_updated) VALUES (?, ?, ?, ?, ?)",
    [
      id,
      faker.commerce.productName(),
      faker.commerce.productDescription(),
      faker.datatype.number(100),
      Date.now(),
    ],
    {
      prepare: true,
    }
  );
  return id;
}

async function deleteItem(client: Client, id: string): Promise<boolean> {
  return client
    .execute("DELETE FROM inventory.main WHERE id = ?;", [id])
    .then((result) => true)
    .catch((err) => false);
}

async function handler(client: Client) {}

export async function emulateClientActivity(client: Client) {
  await client
    .execute(createKeyspace)
    .then((value) => {
      console.log("Success ", value);
    })
    .catch((err) => {
      console.error("Unable to create index 'testing'", err);
    });

  await client.execute(createTable);

  const liveUUIDs = new Set<string>();

  for (let i = 0; i < 10000; ++i) {
    let buffer = [];
    for (let j = 0; j < 100; ++j) {
      buffer.push(createItems(client));
    }
    await Promise.allSettled(buffer);
  }

  console.log("Done emulating client activity");
  return Promise.resolve(true);
}
