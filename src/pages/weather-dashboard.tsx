// import React from 'react'

import { Button } from "../components/ui/button";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import { useGeolocation } from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "../hooks/use-weather";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();
  // console.log(coordinates);

  const weatherQuery = useWeatherQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  // console.log(coordinates);
  // console.log(locationQuery);
  // console.log(weatherQuery);
  // console.log(forecastQuery);

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      // reload weather data
    }
  };
  if (locationLoading) {
    return <WeatherSkeleton />;
  }
  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Plz enable location access to see your local weather~~~</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          // onClick={handleRefresh}
          // disabled={}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      {/* Current and Hourly weather */}
    </div>
  );
};

export default WeatherDashboard;
