import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [currentcity, setCurrentcity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      setIsloading(true);
      const response = await fetch("http://localhost:3001/cities");
      const data = await response.json();
      setCities(data);
      setIsloading(false);
    };

    fetchCities();
  }, []);

  const getCities = async (id) => {
    setIsloading(true);
    const response = await fetch(`http://localhost:3001/cities/${id}`);
    const data = await response.json();
    setCurrentcity(data);
    setIsloading(false);
  };
  const createCity = async (newCity) => {
    setIsloading(true);
    const response = await fetch(`http://localhost:3001/cities/`, {
      method: "POST",
      body: JSON.stringify(newCity),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setCities((cities) => [...cities, data]);
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
