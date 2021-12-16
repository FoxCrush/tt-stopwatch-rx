import { Component } from "react";
import "./App.css";
import TimerContainer from "./components/timer";

class App extends Component {
  render() {
    return (
      <div className="App">
        <TimerContainer />
      </div>
    );
  }
}

export default App;
