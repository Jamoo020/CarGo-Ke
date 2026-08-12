import app from "./app";
import { config } from "./config";

const port = config.port;

app.listen(port, () => {
  console.log(`CarGo Kenya backend is running on http://localhost:${port}`);
});
