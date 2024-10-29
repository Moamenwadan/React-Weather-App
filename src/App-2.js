import { useEffect, useState } from "react";
import { MainComponent } from "./MainComponent";

export default function App() {
  const [query, setQurey] = useState("");
  const [weather, setWeather] = useState(function () {
    const storage = localStorage.getItem("weather");
    return JSON.parse(storage) || {};
  });

  const [displayLocation, setDisplayLocation] = useState(function () {
    const storage = localStorage.getItem("location");
    return JSON.parse(storage) || "";
  });
  const [isLoading, setIsLoading] = useState(false);
  //   console.log(query);
  useEffect(
    function () {
      async function fetchWeather() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
          );
          //   console.log(res);
          if (!res.ok) throw new Error("wrong hapeen in fetching");
          const data = await res.json();
          //   console.log(data);
          const { name, latitude, longitude, timezone } = data.results[0];
          setDisplayLocation(name);
          const resWeather = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          //   console.log(resWeather);
          const weatherforcity = await resWeather.json();
          //   console.log(weatherforcity.daily);
          setWeather(weatherforcity);
        } catch (error) {
          //   console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchWeather();
    },
    [query]
  );
  useEffect(
    function () {
      localStorage.setItem("weather", JSON.stringify(weather));
    },
    [weather]
  );
  useEffect(
    function () {
      localStorage.setItem("location", JSON.stringify(displayLocation));
    },
    [displayLocation]
  );
  useEffect(
    function () {
      if (!displayLocation) return;
      document.title = `Weather For ${displayLocation}`;
      return () => (document.title = "Weather App");
    },
    [displayLocation]
  );
  return (
    <MainComponent
      query={query}
      setQurey={setQurey}
      weather={weather}
      isLoading={isLoading}
      displayLocation={displayLocation}
    />
  );
}
