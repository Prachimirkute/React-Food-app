import { useContext } from "react";
import { ThemeContext } from "../../App";
import "./style.css";

const ThemeButton = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  console.log(theme, setTheme);

  return (
    <button
      style={theme ? { backgroundColor: "#12343b" } : {}}
      onClick={() => setTheme(!theme)}
      className="toggle-theme"
    >
      Change Theme
    </button>
  );
};

export default ThemeButton;
