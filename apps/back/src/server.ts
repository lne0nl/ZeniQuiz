// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import express from "express";
import http from "http";
import "dotenv/config";
import { Server } from "socket.io";
import { QuizSocket } from "./interfaces/QuizSocket";
import * as quizHandler from "./quizHandler";
import type { Quiz, Team } from "types";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:4173",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 8080;

io.on("connect", (socket: QuizSocket) => {
  socket.on("create", (quiz: Quiz) => quizHandler.createQuiz(socket, quiz));

  socket.on("display-quiz", async (quizID: string, URL: string) =>
    quizHandler.displayQuiz(io, socket, quizID, URL)
  );

  socket.on("check-quiz", (quizID: string, fromDisplay: boolean) =>
    quizHandler.checkQuiz(io, socket, quizID, fromDisplay)
  );

  socket.on("start-quiz", (quizID: string) =>
    quizHandler.startQuiz(io, quizID)
  );

  socket.on("add-team", (quizID: string, team: Team, role: string) =>
    quizHandler.addTeam(io, socket, quizID, team, role)
  );

  socket.on("show-code", (quizID: string) => quizHandler.showCode(io, quizID));

  socket.on("toggle-buzz", (quizID: string, disableBuzz: boolean) =>
    quizHandler.toggleBuzz(io, quizID, disableBuzz)
  );

  socket.on("buzz", (teamID: string, quizID: string) =>
    quizHandler.buzz(io, teamID, quizID)
  );

  socket.on("raz-buzz", (quizID: string) => quizHandler.razBuzz(io, quizID));

  socket.on("add-point", (quizID: string, teamName: string) =>
    quizHandler.addPoint(io, quizID, teamName)
  );

  socket.on("remove-point", (quizID: string, teamName: string) =>
    quizHandler.removePoint(io, quizID, teamName)
  );

  socket.on("win", (quizID: string) => quizHandler.win(io, quizID));

  socket.on("lose", (quizID: string) => quizHandler.lose(io, quizID));

  socket.on("raz-score", (quizID: string) => quizHandler.razScore(io, quizID));

  socket.on("raz", (quizID: string) => quizHandler.raz(io, quizID));

  socket.on("disconnect", () => quizHandler.disconnect(io, socket));
});

server.listen(port, "localhost", () => console.log(`Running server on http://${server.address().address}:${port}`));
