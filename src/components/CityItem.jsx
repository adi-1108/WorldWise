import React from "react";
import styles from "./CityItem.module.css";
import { Link, useParams } from "react-router-dom";
import { useCities } from "../contexts/Citiescontext";
import Spinner from "./Spinner";

const CityItem = ({ city }) => {
  const { currentcity, deleteCity, isloading } = useCities();
  const { cityName, emoji, date, id, position } = city;
  const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(new Date(date));

  const handleClick = (e) => {
    e.preventDefault();
    deleteCity(id);
  };
  if (isloading) return <Spinner />;
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentcity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
};

export default CityItem;
