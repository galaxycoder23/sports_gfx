import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./index.css";

import Landing from "./pages/landing";

import Control from "./pages/lt_control";
import GraphControl from "./pages/graph_control";
import ScoreControl from "./pages/score_control";
import TimerControlBoxing from "./pages/timer_control_boxing";

import LowerThirdGraphic from "./pages/lt_graphic";
import LowerThirdGraphicNetball from "./pages/lt_graphic_netball";
import LowerThirdGraphicAmericanFootball from "./pages/lt_graphic_american_football";

import GraphGraphic from "./pages/graph_graphic";
import GraphGraphicNetball from "./pages/graph_graphic_netball";
import GraphGraphicAmericanFootball from "./pages/graph_graphic_american_football";

import ScoreGraphic from "./pages/score_graphic";
import TimerGraphicBoxing from "./pages/timer_graphic_boxing";

const graphicRoutes = [
  {
    suffix: "",
    lowerThird: LowerThirdGraphic,
    graph: GraphGraphic,
  },
  {
    suffix: "_netball",
    lowerThird: LowerThirdGraphicNetball,
    graph: GraphGraphicNetball,
  },
  {
    suffix: "_american_football",
    lowerThird: LowerThirdGraphicAmericanFootball,
    graph: GraphGraphicAmericanFootball,
  },
];

const router = createBrowserRouter([
  {
    path: "/lt_control",
    element: <Control />,
  },
  {
    path: "/graph_control",
    element: <GraphControl />,
  },
  {
    path: "/score_control",
    element: <ScoreControl/>,
  },
  {
    path: "/timer_boxing",
    element: <TimerGraphicBoxing/>,
  },
  {
    path: "/timer_control_boxing",
    element: <TimerControlBoxing />,
  },

  ...graphicRoutes.flatMap((route) => [
    {
      path: `/lt${route.suffix}`,
      element: <route.lowerThird />,
    },
    {
      path: `/graph${route.suffix}`,
      element: <route.graph />,
    },
  ]),

  {
    path: "/score",
    element: <ScoreGraphic />,
  },
  {
    path: "*",
    element: <Landing />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
