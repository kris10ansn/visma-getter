import React from "react";
import TimeTable from "./components/TimeTable";
import "./App.scss";

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="interact">
                <input type="text" />
                <br />
                <input type="text" />
                <br />
                <input type="text" />
                <br />
            </div>
            <div className="timeatable-container">
                <TimeTable />
            </div>
        </div>
    );
};

export default App;
