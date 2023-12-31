import { useCallback, useReducer } from "react";
import { useMemo } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
// import { act } from "react-dom/test-utils";
import { ThemeContext } from "../../App";
import FavoriteItem from "../../components/favorites-item";
import RecipeItem from "../../components/receipe-item";
import Search from "../../components/search";
import "./style.css";

const reducer = (state, action) => {
  switch (action.type) {
    case "filterFavorites":
      console.log(action);

      return {
        ...state,
        filteredValue: action.value,
      };

    default:
      return state;
  }
};

const initialState = {
  filteredValue: "",
};

const Homepage = () => {
  //loading state

  const [loadingState, setLoadingState] = useState(false);

  //save results that we receive from api

  const [recipes, setRecipes] = useState([]);

  //favorites data state

  const [favorites, setFavorites] = useState([]);

  //state for api is succesfull or not

  const [apiCalledSuccess, setApiCalledSuccess] = useState(false);

  // use reducer functionality

  const [filteredState, dispatch] = useReducer(reducer, initialState);

  const { theme } = useContext(ThemeContext);

  const getDataFromSearchComponent = (getData) => {
    //keep the loading state as true before we are calling the api
    setLoadingState(true);

    //calling the api

    async function getReceipes() {
      const apiResponse = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=0b486e71c68f4b9c9a0e5430c2d4b447&query=${getData}`
      );
      const result = await apiResponse.json();
      const { results } = result;

      if (results && results.length > 0) {
        //set loading state as false again
        //set the recipes state

        setLoadingState(false);
        setRecipes(results);
        setApiCalledSuccess(true);
      }
    }

    getReceipes();
  };

  const addToFavorites = useCallback(
    (getCurrentRecipeItem) => {
      let cpyFavorites = [...favorites];

      const index = cpyFavorites.findIndex(
        (item) => item.id === getCurrentRecipeItem.id
      );
      if (index === -1) {
        cpyFavorites.push(getCurrentRecipeItem);
        setFavorites(cpyFavorites);
        //save the favorites in local stroage
        localStorage.setItem("favorites", JSON.stringify(cpyFavorites));
        window.scrollTo({ top: "0", behavior: "smooth" });
      } else {
        alert("Item is already present in favorites");
      }
    },
    [favorites]
  );

  const removeFromFavorites = (getCurrentId) => {
    let cpyFavorites = [...favorites];
    cpyFavorites = cpyFavorites.filter((item) => item.id !== getCurrentId);

    setFavorites(cpyFavorites);
    localStorage.setItem("favorites", JSON.stringify(cpyFavorites));
  };

  useEffect(() => {
    const extractFavoritesFromLocalStroageOnPageLoad =
      JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(extractFavoritesFromLocalStroageOnPageLoad);
  }, []);

  console.log(filteredState, "filteredState");

  //filter the favorites

  const filteredFavoritesItems =
    favorites && favorites.length > 0
      ? favorites.filter((item) =>
          item.title.toLowerCase().includes(filteredState.filteredValue)
        )
      : [];

  const renderRecipes = useCallback(() => {
    if (recipes && recipes.length > 0) {
      return recipes.map((item) => (
        <RecipeItem
          addToFavorites={() => addToFavorites(item)}
          id={item.id}
          image={item.image}
          title={item.title}
        />
      ));
    }
  }, [recipes, addToFavorites]);

  return (
    <div className="homepage">
      <Search
        getDataFromSearchComponent={getDataFromSearchComponent}
        // dummydatacopy={dummydata}
        apiCalledSuccess={apiCalledSuccess}
        setApiCalledSuccess={setApiCalledSuccess}
      />

      {/* show favorites items */}

      <div className="favorites-wrapper">
        <h1
          style={theme ? { color: "#12343b" } : {}}
          className="favorites-title"
        >
          Favorites
        </h1>

        <div className="search-favorites">
          <input
            onChange={(event) =>
              dispatch({ type: "filterFavorites", value: event.target.value })
            }
            value={filteredState.filteredValue}
            name="searchfavorites"
            placeholder="Search Favorites"
          />
        </div>

        <div className="favorites">
          {!filteredFavoritesItems.length && (
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
              className="no-items"
            >
              No favorites are found
            </div>
          )}
          {filteredFavoritesItems && filteredFavoritesItems.length > 0
            ? filteredFavoritesItems.map((item) => (
                <FavoriteItem
                  removeFromFavorites={() => removeFromFavorites(item.id)}
                  id={item.id}
                  image={item.image}
                  title={item.title}
                />
              ))
            : null}
        </div>
      </div>

      {/* show favorites items */}

      {/* show loading state */}

      {loadingState && (
        <div className="loading">Loading recipes ! Please wait.</div>
      )}

      {/* show loading state */}

      {/* map through all the recipes */}

      <div className="items">
        {/* {renderRecipes()} */}

        {useMemo(
          () =>
            !loadingState && recipes && recipes.length > 0
              ? recipes.map((item) => (
                  <RecipeItem
                    addToFavorites={() => addToFavorites(item)}
                    id={item.id}
                    image={item.image}
                    title={item.title}
                  />
                ))
              : null,
          [loadingState, recipes, addToFavorites]
        )}

        {/* {recipes && recipes.length > 0
          ? recipes.map((item) => (
              <RecipeItem
                addToFavorites={() => addToFavorites(item)}
                id={item.id}
                image={item.image}
                title={item.title}
              />
            ))
          : null} */}
      </div>

      {/* map through all the recipes */}

      {!loadingState && !recipes.length && (
        <div className="no-items"> No Recipes are found</div>
      )}
    </div>
  );
};

export default Homepage;
