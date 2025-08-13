import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
	error: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void => {
	console.error("Error:", error.message);

	if (error.name === "ValidationError") {
		res.status(400).json({ message: error.message });
		return;
	}

	if (error.name === "CastError") {
		res.status(400).json({ message: "Invalid ID format" });
		return;
	}

	res.status(500).json({ message: "Internal server error" });
};
