import "dotenv/config";
import { server } from "./app.js";
import db_pool from "./db/connection.js";

db_pool
  .connect()
  .then(() => {
    const PORT = process.env.PORT;
    server.listen(PORT, "::", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect database: ${err}`);
  });
