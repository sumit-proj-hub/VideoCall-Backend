import "dotenv/config";
import { app } from "./app.js";
import db_client from "./db/connection.js";

db_client
  .connect()
  .then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Failed to connect database: ${err}`);
  });
