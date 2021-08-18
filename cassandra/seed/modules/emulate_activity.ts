import { Client } from "cassandra-driver";
import faker from "faker";
import { v4 } from "uuid";

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

async function createItems(client: Client, count: number): Promise<void> {
  const promises: Array<Promise<boolean>> = new Array(count);

  for (let i = 0; i < count; ++i) {
    const id = v4();
    promises[i] = client
      .execute(
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
      )
      .then((_) => true);
  }

  const results = await Promise.allSettled(promises);

  console.log(
    "Successful writes:",
    results.filter((res) => res.status === "fulfilled").length
  );

  return;
}

async function readItems(client: Client, count: number): Promise<void> {
  const { rows } = await client.execute(
    "SELECT * FROM inventory.main LIMIT ?",
    [count],
    { prepare: true }
  );

  console.log("Simulating client reads over", rows.length, "rows.");

  const promises: Array<Promise<boolean>> = new Array(rows.length);

  for (let idx = 0; idx < rows.length; ++idx) {
    promises[idx] = client
      .execute(
        "SELECT * FROM inventory.main WHERE id = ?",
        [rows[idx]["id"].toString()],
        {
          prepare: true,
        }
      )
      .then((_) => true);
  }

  const results = await Promise.allSettled(promises);
  console.log(
    "Read successes:",
    results.filter((v) => v.status === "fulfilled").length
  );

  return;
}

async function deleteItems(client: Client, id: string): Promise<boolean> {
  return client
    .execute("DELETE FROM inventory.main WHERE id = ?;", [id])
    .then((result) => true);
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

  for (let i = 0; i < 100; ++i) {
    const read = readItems(client, 1000);
    const write = createItems(client, 1000);

    await read;
    await write;
  }

  console.log("Done emulating client activity.");

  return Promise.resolve(true);
}
