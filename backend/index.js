import express, { json } from "express";
import cors from "cors";
import UserRoutes from "./routes/users.js";
import IoTRoutes from "./routes/iot.js"

const app = express();
app.use(json());
app.use(cors());
const port = 3002
app.get("/", (req, res)=>{
    return res.send("Hello Aqua");
});

app.use("/users", UserRoutes);
app.use("/iot", IoTRoutes);

app.listen(port, () => {
    console.log(`app listening on  http://localhost:${port}`)
  });