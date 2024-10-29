import { Day } from "./Day";
export function Weather({ weather, displayLocation }) {
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
            isToday={i === 0}
          />
        ))}
      </div>
    </>
  );
}
function SelectCity({ displayLocation }) {
  return (
    <div className="select-city">
      <h1 className="city-name">weather for {displayLocation}</h1>
    </div>
  );
}
