import { useEffect, useState } from "react";

// const persons = {
//   name: ["abas", "hashem", "moamen"],
// };
// const { name: n } = persons;
// console.log(n);
// const days = ["FRI", "Sat", "SUN", "Mon", "TUS", "wed"];
// open-meteo
function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}
export default function App() {
  const [query, setQurey] = useState("");
  const [weather, setWeather] = useState(function () {
    const storage = localStorage.getItem("weather");
    return JSON.parse(storage) || {};
  });

  const [displayLocation, setDisplayLocation] = useState(function () {
    const storage = localStorage.getItem("location");
    return JSON.parse(storage);
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
function MainComponent({
  query,
  setQurey,
  weather,
  isLoading,
  displayLocation,
}) {
  return (
    <div className="header container">
      <h1 className="title">Classy Weather</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          //   console.log(query);
          return setQurey(e.target.value.toUpperCase());
        }}
      ></input>

      {weather.daily &&
        (isLoading ? (
          <Loader />
        ) : (
          <Weather
            weather={weather}
            query={query}
            displayLocation={displayLocation}
          />
        ))}
    </div>
  );
}
function Loader() {
  return (
    <h1
      style={{
        textAlign: "center",
        fontWeight: "lighter",
        marginBottom: "20px",
      }}
    >
      Loading...
    </h1>
  );
}
function SelectCity({ displayLocation }) {
  return (
    <div className="select-city">
      <h1 className="city-name">weather for {displayLocation}</h1>
    </div>
  );
}
function Weather({ weather, displayLocation }) {
  console.log(weather);
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: days,
    weathercode: codes,
  } = weather.daily;
  return (
    <>
      <SelectCity displayLocation={displayLocation} />
      <div className="weather-week">
        {days?.map((el, i) => (
          <Day
            key={i}
            min={min[i]}
            days={days[i]}
            max={max[i]}
            codes={codes[i]}
          />
        ))}
      </div>
    </>
  );
}

function Day({ min, max, days, codes }) {
  return (
    <div className="weather-day">
      <h1>{getWeatherIcon(codes)}</h1>
      <h3>{formatDay(days)}</h3>
      <h2>
        {Math.floor(min)}-{Math.ceil(max)}
      </h2>
    </div>
  );
}
