import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

const CitiesContext = createContext();
const initialState = {
  cities: [],
  isloading: false,
  currentcity: {},
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isloading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isloading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isloading: false,
        currentcity: action.payload,
      };
    case "city/created":
      return {
        ...state,
        isloading: false,
        cities: [...state.cities, action.payload],
      };

    case "city/deleted":
      return {
        ...state,
        isloading: false,
        cities: state.cities.filter((city) => city.id !== id),
      };
    case "rejected":
      return {
        ...state,
        isloading: false,
        error: action.payload,
      };
    default:
      throw new Error("Unknown Action Type");
  }
};
const CitiesProvider = ({ children }) => {
  // const [cities, setCities] = useState([]);
  // const [isloading, setIsloading] = useState(false);
  // const [currentcity, setCurrentcity] = useState({});
  const [{ cities, isloading, currentcity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    dispatch({ type: "loading" });
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:3001/cities");
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {}
    };

    fetchCities();
  }, []);

  const getCities = async (id) => {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`http://localhost:3001/cities/${id}`);
      const data = await response.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "Error fetching the city data" });
    }
  };

  const createCity = async (newCity) => {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`http://localhost:3001/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      dispatch({ type: "city/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: "Error Adding the city" });
    }
  };

  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      await fetch(`http://localhost:3001/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: "Error deleting the Data" });
    }

    setCities((cities) => cities.filter((city) => city.id !== id));
    setIsloading(false);
  };
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isloading,
        currentcity,
        getCities,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context was used outside the Scope of the context");
  return context;
};

export { CitiesProvider, useCities };
