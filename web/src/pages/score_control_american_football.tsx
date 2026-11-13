import { useEffect, useState } from "react";
import { socket } from "../socket";

export interface Score {
  team_a: string;
  team_b: string;
  team_a_colour: string;
  team_b_colour: string;
  score_a: number;
  score_b: number;
  timeouts_a: number;
  timeouts_b: number;
  active: boolean;
  quarter: string;
  down: number;
  distance: number;
}

export default function ScoreControl() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [state, setState] = useState<Score>({ team_a: "", team_b: "", team_a_colour: "#C20019", team_b_colour: "#1B1B1B", score_a: 0, score_b: 0, timeouts_a: 3, timeouts_b: 3, active: false, quarter: "", down: 1, distance: 10 });

  function update(patch: Partial<Score>) {
    const nextState = {
      ...state,
      ...patch,
    };

    setStateViaSocket(nextState);
  }

  useEffect(() => {

    function onState(msg: any) {
      console.log("onState", msg);
      setState(msg);
    }

    socket.on("score_state", onState);

    return () => {
      socket.off("score_state", onState);
    };
  }, []);

  function setStateViaSocket(state: Score) {
    socket.emit("score_update", state);
  }

  function addTouchdown(team: "a" | "b") {
    update({
      [`score_${team}`]:
        state[`score_${team}`] + 6,
    } as Partial<Score>);
  }

  function addFieldGoal(team: "a" | "b") {
    update({
      [`score_${team}`]:
        state[`score_${team}`] + 3,
    } as Partial<Score>);
  }

  function changeTimeout(
    team: "a" | "b",
    amount: number
  ) {
    const key =
      `timeouts_${team}` as
      "timeouts_a" |
      "timeouts_b";

    update({
      [key]: Math.min(
        3,
        Math.max(
          0,
          state[key] + amount
        )
      ),
    });
  }

  return (
    <>
      <div className="flex bg-slate-200">
        <div className="p-4 w-full max-w-md mx-auto">
          {/* Existing code */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team_a">
              Team A
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="team_a"
              type="text"
              value={state?.team_a || ""}
              onChange={(e) => setStateViaSocket({ ...state, team_a: e.target.value } as Score)}
              disabled={!isEditMode}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team A Colour
            </label>

            <input
              type="color"
              value={state.team_a_colour}
              onChange={(e) =>
                update({
                  team_a_colour:
                    e.target.value,
                })
              }
              disabled={!isEditMode}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team_b">
              Team B
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="team_b"
              type="text"
              value={state?.team_b || ""}
              onChange={(e) => setStateViaSocket({ ...state, team_b: e.target.value } as Score)}
              disabled={!isEditMode}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Team B Colour
            </label>

            <input
              type="color"
              value={state.team_b_colour}
              onChange={(e) =>
                update({
                  team_b_colour:
                    e.target.value,
                })
              }
              disabled={!isEditMode}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quarter">
              Quarter
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="quarter"
              value={state?.quarter || ""}
              onChange={(e) => setStateViaSocket({ ...state, quarter: e.target.value } as Score)}
              disabled={!isEditMode}
            >
              <option value="">Select Quarter</option>
              <option value="Q1">Q1</option>
              <option value="Q2">Q2</option>
              <option value="Q3">Q3</option>
              <option value="Q4">Q4</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Down
            </label>

            <div className="flex items-center gap-3">
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={() =>
                  update({
                    down: Math.max(
                      1,
                      state.down - 1
                    ),
                  })
                }
                disabled={!isEditMode}
              >
                -
              </button>

              <span>{state.down}</span>

              <button
                className="bg-blue-500 text-white px-3 py-2 rounded"
                onClick={() =>
                  update({
                    down: Math.min(
                      4,
                      state.down + 1
                    ),
                  })
                }
                disabled={!isEditMode}
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Distance
            </label>

            <input
              type="number"
              value={state.distance}
              onChange={(e) =>
                update({
                  distance:
                    Number(
                      e.target.value
                    ),
                })
              }
              disabled={!isEditMode}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 mb-4">
            <div>
              <div className="flex items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setStateViaSocket({ ...state, score_a: (state?.score_a || 0) + 1 } as Score)}
                  disabled={!isEditMode}
                >
                  +
                </button>
                <span className="mx-4 text-xl">{state?.score_a || 0}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setStateViaSocket({ ...state, score_a: (state?.score_a || 0) - 1 } as Score)}
                  disabled={!isEditMode}
                >
                  -
                </button>
              </div>
              <div className="mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-2 rounded"
                  onClick={() =>
                    addTouchdown("a")
                  }
                  disabled={!isEditMode}
                >
                  +6 TD
                </button>
              </div>
              <div className="mt-2">
                <button
                  className="bg-indigo-600 text-white px-3 py-2 rounded"
                  onClick={() =>
                    addFieldGoal("a")
                  }
                  disabled={!isEditMode}
                >
                  +3 FG
                </button>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    className="bg-red-500 text-white px-3 py-2 rounded"
                    onClick={() =>
                      changeTimeout("a", -1)
                    }
                    disabled={!isEditMode}
                  >
                    -
                  </button>

                  <span>
                    TO: {state.timeouts_a}/3
                  </span>

                  <button
                    className="bg-blue-500 text-white px-3 py-2 rounded"
                    onClick={() =>
                      changeTimeout("a", 1)
                    }
                    disabled={!isEditMode}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setStateViaSocket({ ...state, score_b: (state?.score_b || 0) + 1 } as Score)}
                  disabled={!isEditMode}
                >
                  +
                </button>
                <span className="mx-4 text-xl">{state?.score_b || 0}</span>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => setStateViaSocket({ ...state, score_b: (state?.score_b || 0) - 1 } as Score)}
                  disabled={!isEditMode}
                >
                  -
                </button>
              </div>
              <div className="mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-2 rounded"
                  onClick={() =>
                    addTouchdown("b")
                  }
                  disabled={!isEditMode}
                >
                  +6 TD
                </button>
              </div>
              <div className="mt-2">
                <button
                  className="bg-indigo-600 text-white px-3 py-2 rounded"
                  onClick={() =>
                    addFieldGoal("b")
                  }
                  disabled={!isEditMode}
                >
                  +3 FG
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  className="bg-red-500 text-white px-3 py-2 rounded"
                  onClick={() =>
                    changeTimeout("b", -1)
                  }
                  disabled={!isEditMode}
                >
                  -
                </button>

                <span>
                  TO: {state.timeouts_b}/3
                </span>

                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                  onClick={() =>
                    changeTimeout("b", 1)
                  }
                  disabled={!isEditMode}
                >
                  +
                </button>
              </div>
            </div>
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
