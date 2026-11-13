import { useEffect, useState } from "react";
import { socket } from "../socket";

export interface ScoreBoxing {
  participant_a: string;
  participant_b: string;
  colour_a: string;
  colour_b: string;
  active: boolean;
  round: string;
  start_time: number;
}

export default function ScoreControl() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [state, setState] = useState<ScoreBoxing>({ participant_a: "", participant_b: "", colour_a: "#ff0000", colour_b: "#ff0000", active: false, round: "", start_time: 0 });
  const [time, setTime] = useState(0); // 2 minutes in seconds

  function updateTime() {
    setTime((state.start_time) - Math.floor(Date.now() / 1000) + 120);
  }

  useEffect(() => {
    console.log("useEffect");
    let timer: NodeJS.Timeout;
    updateTime();
    timer = setInterval(() => {
      updateTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [state.start_time]);

  useEffect(() => {

    function onState(msg: any) {
      console.log("onState", msg);
      setState(msg);
    }

    socket.on("timer_state", onState);

    return () => {
      socket.off("timer_state", onState);
    };
  }, []);

function setStateViaSocket(newState: ScoreBoxing) {
    setState(newState);
    socket.emit("timer_update", newState);
}

  function setStartTimeToNow() {
    const now = Math.floor(Date.now() / 1000);
    setStateViaSocket({ ...state, start_time: now } as ScoreBoxing);
  }

  function incrementStartTime(seconds: number) {
    setStateViaSocket({ ...state, start_time: (state.start_time || 0) + seconds } as ScoreBoxing);
  }

  return (
    <>
      <div className="flex bg-slate-200">
        <div className="p-4 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={setStartTimeToNow}
              disabled={!isEditMode}
            >
              Start 02:00
            </button>
            <div className="flex items-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => incrementStartTime(5)}
                disabled={!isEditMode}
              >
                +5s
              </button>
              <span className="mx-4 text-xl">{Math.floor(Math.max(time, 0) / 60)}:{String(Math.max(time, 0) % 60).padStart(2, "0")}</span>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => incrementStartTime(-5)}
                disabled={!isEditMode}
              >
                -5s
              </button>
            </div>
          </div>
          {/* Existing code */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="participant_a">
              Participant A
            </label>
            <div className="flex gap-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="participant_a"
                type="text"
                value={state?.participant_a || ""}
                onChange={(e) => setStateViaSocket({ ...state, participant_a: e.target.value } as ScoreBoxing)}
                disabled={!isEditMode}
              />
              <input
                className="border rounded w-10 h-10 cursor-pointer"
                id="colour_a"
                type="color"
                value={state?.colour_a || ""}
                onChange={(e) => setStateViaSocket({ ...state, colour_a: e.target.value } as ScoreBoxing)}

                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="participant_b">
              Participant B
            </label>
            <div className="flex gap-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="participant_b"
                type="text"
                value={state?.participant_b || ""}
                onChange={(e) => setStateViaSocket({ ...state, participant_b: e.target.value } as ScoreBoxing)}
                disabled={!isEditMode}
              />
              <input
                className="border rounded w-10 h-10 cursor-pointer"
                id="colour_b"
                type="color"
                value={state?.colour_b || ""}
                onChange={(e) => setStateViaSocket({ ...state, colour_b: e.target.value } as ScoreBoxing)}
                disabled={!isEditMode}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="round">
              Round
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="round"
              value={state?.round || ""}
              onChange={(e) => setStateViaSocket({ ...state, round: e.target.value } as ScoreBoxing)}
              disabled={!isEditMode}
            >
              <option value="">Select Round</option>
              <option value="1 of 3">Round 1</option>
              <option value="2 of 3">Round 2</option>
              <option value="3 of 3">Round 3</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {isEditMode ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}