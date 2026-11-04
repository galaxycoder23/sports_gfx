import { Server, Socket } from "socket.io";


interface TimerBoxing {
    team_a: string;
    team_b: string;
    colour_a: string;
    colour_b: string;
    active: boolean;
    round: string;
    start_time: number;
}

let state:TimerBoxing = {
    team_a: "Team A",
    team_b: "Team B",
    round: "1 of 3",
    colour_a: "#000000",
    colour_b: "#000000",
    active: false,
    start_time: 0
}

export default function init(){
    console.log("init to TimerHandlerBoxing");
}

export function addConnection(socket: Socket, io: Server) {
    console.log("connected to TimerHandler");
    io.emit("timer_state", state);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("timer_update", (_state:TimerBoxing)  => {
        state = _state;
        io.emit("timer_state", state);
    });

    socket.on("timer_stop", (id: string) => {
        state.active = false;
        io.emit("timer_state", state);

    });

    socket.on("timer_play", (id: string) => {
        state.active = true;
        io.emit("timer_state", state);
    
    });


}
