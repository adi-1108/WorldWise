// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useURLposition } from "../hooks/useURLposition";
import DatePicker from "react-datepicker";
import Spinner from "./Spinner";
import Message from "./Message";
import "react-datepicker/dist/react-datepicker.css";

import { useCities } from "../contexts/Citiescontext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const { lat: mapLat, lng: mapLng } = useURLposition();
  const [geoLocationLoading, setGeoLocationLoading] = useState(false);
  const [geoLocationError, setGeoLocationError] = useState("");
  const [emoji, setEmoji] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const { createCity, isloading } = useCities();

  useEffect(() => {
    const fetchLocation = async () => {
      if (!mapLat || !mapLng) return;
      try {
        setGeoLocationLoading(true);
        setGeoLocationError("");

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`
        );

        const data = await res.json();
        // console.log(data);
        if (!data.city || !data.locality)
          throw new Error("This dosen't seems like a city");
        setCityName(data.city);
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode));
      } catch (error) {
        setGeoLocationError(error.message);
      } finally {
        setGeoLocationLoading(false);
      }
    };

    fetchLocation();
  }, [mapLat, mapLng]);

  const handleSumbit = (e) => {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      position: { lat: mapLat, lng: mapLng },
      emoji,
      date,
      notes,
    };
    // console.log(newCity);
    createCity(newCity);
    navigate("/app/cities");
  };

  if (geoLocationLoading) return <Spinner />;
  if (geoLocationError) return <Message message={geoLocationError} />;

  return (
    <form
      onSubmit={handleSumbit}
      className={`${styles.form} ${isloading ? styles.loading : styles.form}`}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          className="text-black font-semibold"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          className="text-black font-semibold"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          className="text-black font-semibold"
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate("/app/cities");
          }}
          type="back"
        >
          Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
