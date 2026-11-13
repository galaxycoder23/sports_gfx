import { useEffect, useState } from "react";
import style from "../css/score.boxing.module.css";
import { socket } from "../socket";
import { ScoreBoxing } from "./score_control_boxing";

export default function ScoreGraphic() {
  const [state, setState] = useState<ScoreBoxing>({
    participant_a: "",
    participant_b: "",
    colour_a: "#ff0000ff",
    colour_b: "#ff0000ff",
    active: false,
    round: "",
    start_time: 0,
  });
  const [time, setTime] = useState(0); // 2 minutes in seconds

  function updateTime() {
    setTime((state.start_time) - Math.floor(Date.now() / 1000) + 120);
  }

  useEffect(() => {
    console.log("useEffect");
    let timer: NodeJS.Timeout;

    timer = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [state.start_time]);

  useEffect(() => {
    function onState(state: ScoreBoxing) {
      console.log("onState", state);
      setState(state);
    }

    socket.on("timer_state", onState);

    return () => {
      socket.off("timer_state", onState);
    };
  }, []);

  return (
    <div id={style.mask}>
      <div id={style.scorebar}>
        <div className={style.participantAColour}></div>
        <div className={style.participantName}>{state.participant_a}</div>
        <div className={style.time}>
          {Math.floor(Math.max(time, 0) / 60)}:{String(Math.max(time, 0) % 60).padStart(2, "0")}
        </div>
        <div className={style.round}>{state.round}</div>
        <div className={style.participantName}>{state.participant_b}</div>
        <div className={style.participantBColour}></div>
      </div>
    </div>
  );
}