import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Toolbox from "./components/Toolbox";
import BoardContextProvider from "./store/boardContextProvider";
import ToolboxContextProvider from "./store/toolboxContextProvider";

function App() {
  return (
    <BoardContextProvider>
      <ToolboxContextProvider>
        <Toolbar />
        <Board />
        <Toolbox />
      </ToolboxContextProvider>
    </BoardContextProvider>
  )
}

export default App
