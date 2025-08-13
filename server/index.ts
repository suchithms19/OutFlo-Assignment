import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/database.js";
import { apiRoutes } from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/ping", (_req, res) => {
	res.send("pong");
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
