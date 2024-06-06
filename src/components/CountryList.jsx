import React from "react";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/Citiescontext";
const CountryList = () => {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message={"Add your first city by clikcing on the map"} />;
  //   const countries = cities.reduce((acc, curr) => {
  //     if (!acc.map((el) => el.country).includes(curr.country))
  //       return [...acc, { country: curr.country, emoji: curr.emoji }];
  //     else return acc;
  //   },[]);

  return (
    <ul className={styles.countryList}>
      {cities?.map((city) => (
        <CountryItem country={city} key={city.id} />
      ))}
    </ul>
  );
};

export default CountryList;
