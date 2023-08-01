import './App.css';
import Homepage from "./pages/homepage";
import ThemeButton from "./components/themes-buttons";
import { createContext, useState } from "react";

// create the Context
// provide the Context
// consume the Context
export const ThemeContext = createContext(null);
function App() {
  const [theme, setTheme] = useState(false);
  return (
    <ThemeContext.Provider
    value={{
      theme,
      setTheme,
    }}
  >
    <div className="App" style={theme ? { backgroundColor: "#feb300" } : {}}>
      <ThemeButton/>
      <Homepage/>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;
