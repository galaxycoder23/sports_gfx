
import { useEffect, useState } from "react";
import { socket } from "../socket";

export interface ScoreRugby {
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

export default function ScoreControl() {
  const [isEditMode, setIsEditMode] = useState(false);

  const [state, setState] = useState<ScoreRugby>({
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
    half: 1
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
    function onState(msg: ScoreRugby) {
      setState(msg);
    }

    socket.on("rugby_state", onState);

    return () => {
      socket.off("rugby_state", onState);
    };
  }, []);

  function setStateViaSocket(newState: ScoreRugby) {
    setState(newState);
    socket.emit("rugby_update", newState);
  }

  function startClock() {
    if (state.active) return;

    setStateViaSocket({
      ...state,
      active: true,
      start_time: Math.floor(Date.now() / 1000)
    });
  }

  function pauseClock() {
    if (!state.active) return;

    const elapsed =
      Math.floor(Date.now() / 1000) - state.start_time;

    setStateViaSocket({
      ...state,
      time: state.time + elapsed,
      active: false,
      start_time: 0
    });
  }

  function adjustTime(seconds: number) {
    const elapsed = state.active
      ? state.time + Math.floor(Date.now() / 1000) - state.start_time
      : state.time;

    const newTime = Math.max(0, elapsed + seconds);

    setStateViaSocket({
      ...state,
      time: newTime,
      start_time: state.active
        ? Math.floor(Date.now() / 1000)
        : 0
    });
  }

  function startSecondHalf() {
    setStateViaSocket({
      ...state,
      half: 2,
      time: 40 * 60,
      active: false,
      start_time: 0
    });
  }

  function resetClock() {
    setStateViaSocket({
      ...state,
      time: 0,
      active: false,
      start_time: 0,
      half: 1
    });
  }

  function adjustScoring(
    team: "a" | "b",
    type: "tries" | "conversions" | "penalties" | "drop_goals",
    amount: number
  ) {
    const points = {
      tries: 5,
      conversions: 2,
      penalties: 3,
      drop_goals: 3
    };

    const scoreKey = team === "a" ? "score_a" : "score_b";

    const newScore = state[scoreKey] + points[type] * amount;

    if (newScore < 0) return;

    const newState: ScoreRugby = {
      ...state,
      [scoreKey]: newScore
    };

    if (type === "tries") {
      const triesKey = team === "a" ? "tries_a" : "tries_b";

      const newTries = state[triesKey] + amount;

      if (newTries < 0) return;

      newState[triesKey] = newTries;
    }

    setStateViaSocket(newState);
  }

  function renderScoringControls(team: "a" | "b") {
    const score = team === "a" ? state.score_a : state.score_b;
    const tries = team === "a" ? state.tries_a : state.tries_b;
    const teamName = team === "a" ? state.team_a : state.team_b;

    const scoringTypes = [
      { type: "tries", label: "Try", points: 5 },
      { type: "conversions", label: "Conversion", points: 2 },
      { type: "penalties", label: "Penalty", points: 3 },
      { type: "drop_goals", label: "Drop Goal", points: 3 }
    ] as const;

    return (
      <div className="space-y-3 mb-6">
        <div className="font-bold text-xl">
          {teamName || `Team ${team.toUpperCase()}`} Score: {score}
        </div>

        <div className="text-sm text-gray-600">
          Tries: {tries}
        </div>

        {scoringTypes.map(({ type, label, points }) => (
          <div
            className="flex items-center justify-between"
            key={type}
          >
            <span className="font-bold">
              {label} (+{points})
            </span>

            <div className="flex items-center gap-2">
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded disabled:opacity-40"
                type="button"
                onClick={() => adjustScoring(team, type, -1)}
                disabled={
                  !isEditMode ||
                  score < points ||
                  (type === "tries" && tries === 0)
                }
              >
                -
              </button>

              <button
                className="bg-green-500 text-white font-bold py-2 px-4 rounded disabled:opacity-40"
                type="button"
                onClick={() => adjustScoring(team, type, 1)}
                disabled={!isEditMode}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex bg-slate-200">
        <div className="p-4 w-full max-w-md mx-auto">
          <div className="flex items-center justify-end">
            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "Save" : "Edit"}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team A
            </label>

            <div className="flex gap-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="text"
                placeholder="Enter Team A name"
                value={state.team_a}
                onChange={(e) =>
                  setStateViaSocket({
                    ...state,
                    team_a: e.target.value
                  })
                }
                disabled={!isEditMode}
              />

              <input
                className="border rounded w-10 h-10 cursor-pointer"
                type="color"
                value={state.colour_a}
                onChange={(e) =>
                  setStateViaSocket({
                    ...state,
                    colour_a: e.target.value
                  })
                }
                disabled={!isEditMode}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team B
            </label>

            <div className="flex gap-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="text"
                placeholder="Enter Team B name"
                value={state.team_b}
                onChange={(e) =>
                  setStateViaSocket({
                    ...state,
                    team_b: e.target.value
                  })
                }
                disabled={!isEditMode}
              />

              <input
                className="border rounded w-10 h-10 cursor-pointer"
                type="color"
                value={state.colour_b}
                onChange={(e) =>
                  setStateViaSocket({
                    ...state,
                    colour_b: e.target.value
                  })
                }
                disabled={!isEditMode}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded disabled:opacity-40"
              type="button"
              onClick={startClock}
              disabled={!isEditMode || state.active}
            >
              Start
            </button>

            <button
              className="bg-yellow-500 text-white font-bold py-2 px-4 rounded disabled:opacity-40"
              type="button"
              onClick={pauseClock}
              disabled={!isEditMode || !state.active}
            >
              Half-time / Pause
            </button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() => adjustTime(5)}
              disabled={!isEditMode}
            >
              +5s
            </button>

            <span className="mx-4 text-2xl font-bold">
              {Math.floor(time / 60)}:
              {String(time % 60).padStart(2, "0")}
            </span>

            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
              type="button"
              onClick={() => adjustTime(-5)}
              disabled={!isEditMode}
            >
              -5s
            </button>
          </div>

          <button
            className="bg-purple-600 text-white font-bold py-2 px-4 rounded w-full mb-4"
            type="button"
            onClick={startSecondHalf}
            disabled={!isEditMode || state.half === 2 || state.active}
          >
            Start Second Half
          </button>

          <button
            className="bg-gray-600 text-white font-bold py-2 px-4 rounded w-full mb-4"
            type="button"
            onClick={resetClock}
            disabled={!isEditMode}
          >
            Reset Match
          </button>

          {renderScoringControls("a")}
          {renderScoringControls("b")}

        </div>
      </div>
    </>
  );
}
