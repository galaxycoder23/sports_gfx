
import { Server, Socket } from "socket.io";

interface ScoreRugby {
  team_a: string;
  team_b: string;
  colour_a: string;
  colour_b: string;
  score_a: number;
  score_b: number;
  tries_a: number;
  tries_b: number;
  active: boolean;
  time: number;
  start_time: number;
  half: 1 | 2;
}

let state: ScoreRugby = {
  team_a: "",
  team_b: "",
  colour_a: "#0057BF",
  colour_b: "#F07F3C",
  score_a: 0,
  score_b: 0,
  tries_a: 0,
  tries_b: 0,
  active: false,
  time: 0,
  start_time: 0,
  half: 1,
};

export default function init() {
  console.log("Rugby handler initialised");
}

export function addConnection(socket: Socket, io: Server) {
  console.log("Connected to Rugby handler");

  socket.emit("rugby_state", state);

  socket.on("disconnect", () => {
    console.log("Rugby client disconnected");
  });

  socket.on("rugby_update", (_state: ScoreRugby) => {
    state = _state;
    io.emit("rugby_state", state);
  });
}
