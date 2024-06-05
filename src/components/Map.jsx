import React from "react";
import styles from "./Map.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("form");
      }}
      className={styles.mapContainer}
    >
      <h1>Map</h1>
      <p>
        Position : {lat} & {lng}
      </p>
    </div>
  );
};

export default Map;
