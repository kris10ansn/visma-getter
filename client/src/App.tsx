import React from "react";
import TimeTable from "./components/TimeTable";
import "./App.scss";

const App: React.FC = () => {
    return (
        <div className="App">
            <TimeTable style={{ height: "100%", width: "100%" }} />
        </div>
    );
};

export default App;
