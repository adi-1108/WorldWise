import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import "./index.css";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
// import PageNav from "./components/PageNav";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

const App = () => {
  const [cities, setCities] = useState([]);
  const [isloading, setIsloading] = useState(false);

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="app" element={<AppLayout />}>
          <Route
            index
            element={<Navigate to="cities" replace /> }
          />
          <Route
            path="cities"
            element={<CityList cities={cities} isloading={isloading} />}
          />
          <Route path="cities/:id" element={<City />} />
          <Route
            path="countries"
            element={<CountryList cities={cities} isloading={isloading} />}
          />
          <Route path="form" element={<Form />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
