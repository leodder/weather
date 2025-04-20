// import React from 'react'

import { useForecastQuery, useWeatherQuery } from "../hooks/use-weather";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertTriangle } from "lucide-react";
import WeatherSkeleton from "../components/loading-skeleton";
import CurrentWeather from "../components/current-weather";
import HourlyTemprature from "../components/hourly-temprature";
import WeatherDetails from "../components/weather-details";
import WeatherForecast from "../components/weather-forecast";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  // console.log(params);
  
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to refetch weather data. Plz try again.</p>
        </AlertDescription>
      </Alert>
    );
  }
  // console.log(weatherQuery.data);
  // console.log(forecastQuery.data);
  
  
  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div>
      <div className="space-y-4">
        {/* Favorite Cities */}
        <div className="flex items center justify-between">
          <h1 className="text-xl font-bold tracking-tight">{params.cityName}, {weatherQuery.data.sys.country}</h1>
          
        </div>
        <div className="grid gap-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <CurrentWeather
              data={weatherQuery.data}
              // locationName={locationName}
            />

            <HourlyTemprature data={forecastQuery.data} />
          </div>
          <div className="grid gap-6 md:grid-cols-2 items-start">
            <WeatherDetails data={weatherQuery.data} />
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
