import app from "./app";
import { connectDB } from "./db";
import { PORT } from "./config";

async function main() {
  try {
    await connectDB();
    app.listen(PORT);
    console.log("Server listen on port", PORT);
  } catch (error) {
    console.error(error);
  }
}

main();
