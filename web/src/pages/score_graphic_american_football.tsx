import { useEffect, useState } from "react";
import style from "../css/score.americanFootball.module.css";
import { socket } from "../socket";
import { Score } from "./score_control_american_football";

export default function ScoreGraphic() {
  const [state, setState] = useState<Score>({
    team_a: "",
    team_b: "",
    team_a_colour: "",
    team_b_colour: "",
    score_a: 0,
    score_b: 0,
    timeouts_a: 3,
    timeouts_b: 3,
    active: false,
    quarter: "",
    down: 1,
    distance: 10,
  });

  useEffect(() => {
    function onPlay(state: Score) {
      console.log("onPlay", state);
      setState(state);
    }

    function onStop(state: Score) {
      console.log("onStop", state);
    }

    function onState(state: Score) {
      console.log("onState", state);
      setState(state);
    }

    socket.on("score_play", onPlay);
    socket.on("score_stop", onStop);

    socket.on("score_state", onState);

    return () => {
      socket.off("score_play", onPlay);
      socket.off("score_stop", onStop);
    };
  }, []);

  return (
    <div id={style.mask}>
      <div id={style.scorebar}>
        <div
          className={style.teamColor}
          style={{
            backgroundColor: state.team_a_colour,
          }}
        ></div>
        <div className={style.teamName}>{state.team_a}</div>
        <div className={style.scoreBlock}>
          <div className={style.score}>
            {state.score_a}
          </div>

          <div className={style.timeouts}>
            {"●".repeat(state.timeouts_a)}
            {"○".repeat(3 - state.timeouts_a)}
          </div>
        </div>
        <div className={style.gameInfo}>
          <div className={style.quarter}>
            {state.quarter}
          </div>
          <div className={style.downDistance}>
            {state.down} & {state.distance}
          </div>
        </div>
        <div className={style.scoreBlock}>
          <div className={style.score}>
            {state.score_b}
          </div>

          <div className={style.timeouts}>
            {"●".repeat(state.timeouts_b)}
            {"○".repeat(3 - state.timeouts_b)}
          </div>
        </div>
        <div className={style.teamName}>{state.team_b}</div>
        <div
          className={style.teamColor}
          style={{
            backgroundColor: state.team_b_colour,
          }}
        ></div>
      </div>
    </div>
  );
}
