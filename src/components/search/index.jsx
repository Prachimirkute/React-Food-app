import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { ThemeContext } from "../../App";
import "./style.css";

//useState
//useReducer -> complex state

const Search = (props) => {
  console.log(props);
  const { theme } = useContext(ThemeContext);
  const { getDataFromSearchComponent, apiCalledSuccess, setApiCalledSuccess } =
    props;

  const [inputValue, setInputValue] = useState(""); //initial value

  const handleInputvalue = (event) => {
    const { value } = event.target;
    //set the updated state
    setInputValue(value);
  };

  console.log(inputValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    getDataFromSearchComponent(inputValue);
  };

  useEffect(() => {
    if (apiCalledSuccess) {
      setInputValue("");
      setApiCalledSuccess(false);
    }
  }, [apiCalledSuccess, setApiCalledSuccess]);

  return (
    <form onSubmit={handleSubmit} className="Search">
      <input
        name="search"
        onChange={handleInputvalue}
        value={inputValue}
        placeholder="Search Recipes"
        id="search"
      />
      <button style={theme ? { backgroundColor: "#12343b" } : {}} type="submit">
        Search
      </button>
    </form>
  );
};

export default Search;
