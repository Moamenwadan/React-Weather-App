import { Loader } from "./Loader";
import { Weather } from "./Weather";
export function MainComponent({
  query,
  setQurey,
  weather,
  isLoading,
  displayLocation,
}) {
  return (
    <div className="header container">
      <h1 className="title"> Weather App </h1>
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
