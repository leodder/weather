// import React from 'react'

import { Button } from "../components/ui/button";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import { useGeolocation } from "../hooks/use-geolocation";
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "../hooks/use-weather";
import CurrentWeather from "../components/current-weather";

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
      weatherQuery.refetch();
      locationQuery.refetch();
      forecastQuery.refetch();
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

  const locationName = locationQuery.data?.[0];
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to refetch weather data. Plz try again.</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCcw className="mr-2 h-4 w-4" />
            retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <div className="flex items center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
      <div className="grid gap-6">
        <div>
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          {/* current weather */}
          {/* hourly temrature */}
        </div>
        <div>
          {/* detail */}
          {/* forecast */}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
