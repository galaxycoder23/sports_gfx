import { Server, Socket } from "socket.io";

interface ScoreBoxing {
    participant_a: string;
    participant_b: string;
    colour_a: string;
    colour_b: string;
    active: boolean;
    round: string;
    start_time: number;
}

let state: ScoreBoxing = {
    participant_a: "Participant A",
    participant_b: "Participant B",
    round: "1 of 3",
    colour_a: "#000000",
    colour_b: "#000000",
    active: false,
    start_time: 0
};

export default function init() {
    console.log("init to TimerHandlerBoxing");
}

export function addConnection(socket: Socket, io: Server) {
    console.log("connected to TimerHandlerBoxing");

    socket.emit("timer_state", state);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("timer_update", (_state: ScoreBoxing) => {
        state = _state;
        io.emit("timer_state", state);
    });

    socket.on("timer_stop", () => {
        state.active = false;
        io.emit("timer_state", state);
    });

    socket.on("timer_play", () => {
        state.active = true;
        io.emit("timer_state", state);
    });
}
