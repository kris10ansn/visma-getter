import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";

import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekday);
dayjs.extend(isoWeek);

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
