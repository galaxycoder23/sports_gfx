
import { useEffect, useState } from "react";
import style from "../css/score.rugby.module.css";
import { socket } from "../socket";
import { ScoreRugby } from "./score_control_rugby";

export default function ScoreGraphic() {
  const [state, setState] = useState<ScoreRugby>({
    team_a: "",
    team_b: "",
    score_a: 0,
    score_b: 0,
    colour_a: "#0057BF",
    colour_b: "#F07F3C",
    tries_a: 0,
    tries_b: 0,
    active: false,
    half: 1,
    time: 0,
    start_time: 0,
  });

  const [time, setTime] = useState(0);

  function updateTime() {
    if (state.active) {
      setTime(
        state.time + Math.floor(Date.now() / 1000) - state.start_time
      );
    } else {
      setTime(state.time);
    }
  }

  useEffect(() => {
    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [state.time, state.start_time, state.active]);

  useEffect(() => {
    function onState(newState: ScoreRugby) {
      console.log("rugby state", newState);
      setState(newState);
    }

    socket.on("rugby_state", onState);

    return () => {
      socket.off("rugby_state", onState);
    };
  }, []);

  const displayTime = Math.max(time, 0);

  return (
    <div id={style.mask}>
      <div id={style.scorebar}>
        <div
          className={style.teamAColour}
          style={{ backgroundColor: state.colour_a }}
        >
          {state.score_a}
        </div>

        <div className={style.teamName}>
          {state.team_a}
        </div>

        <div className={style.time}>
          {Math.floor(displayTime / 60)}:
          {String(displayTime % 60).padStart(2, "0")}
        </div>

        <div className={style.teamName}>
          {state.team_b}
        </div>

        <div
          className={style.teamBColour}
          style={{ backgroundColor: state.colour_b }}
        >
          {state.score_b}
        </div>
      </div>
    </div>
  );
}
