import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const weatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }
    return acc;
  }, {} as Record<string, DailyForecast>);
  // to learn: array's reduce slice,  as Record<string, DailyForecast> 這是什麼語法, Object.values語法
  const nextDays = Object.values(dailyForecasts).slice(0, 6);
  const formatTemp = (temp: number) => `${Math.round(temp)}°`
  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecst</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => (
            <div key={day.date} className="grid grid-cols-3 items-center gap-2 rounded-lg border p-2 lg:p-4 gap-4">
              <div>
                <p className="text-xs font-medium lg:text-base">{format(new Date(day.date * 1000), "EEE, MMM d")}</p>
                <p className="text-xs text-muted-foreground capitalize">{day.weather.description}</p>
              </div>
              <div className="flex justify-center gap-1">
                <span className="flex items-center text-blue-500 text-xs lg:text-base">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-500 text-xs lg:text-base">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    {formatTemp(day.temp_max)}
                </span>
              </div>
              <div className="flex justify-end gap-1">
                  <span className="flex items-center gap-1 text-xs">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-xs lg:text-base">{day.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs lg:text-base">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <span className="text-xs lg:text-base">{day.wind}</span>
                  </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default weatherForecast;
