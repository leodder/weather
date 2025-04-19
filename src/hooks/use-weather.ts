import { Coordinates } from "../api/types";
import { weatherAPI } from "../api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEYS = {
  // ["weather", coords] 是 react-query 用來識別資料用的 key。
  // 用 as const 是為了讓這個 key 的型別更精準（變成 readonly tuple）。
  // 這樣設計可以避免 key 重複造成 cache 錯誤，不同地點就會有不同的快取資料。
  weather: (coords: Coordinates) => ["weather", coords] as const,
  forecast: (coords: Coordinates) => ["forecast", coords] as const,
  location: (coords: Coordinates) => ["location", coords] as const,
  search: (query: string) => ["location-search", query] as const,
} as const;

export function useWeatherQuery(coordinates: Coordinates | null) {
  return useQuery({
    // coordinates 是 null 時會用 { lat: 0, lon: 0 } 當 key（避免 undefined 出錯）
    queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
    // 如果 coordinates 是 null，就不送請求
    queryFn: () =>
      coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useForecastQuery(coordinates: Coordinates | null) {
  return useQuery({
    // coordinates 是 null 時會用 { lat: 0, lon: 0 } 當 key（避免 undefined 出錯）
    queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
    // 如果 coordinates 是 null，就不送請求
    queryFn: () => (coordinates ? weatherAPI.getForecast(coordinates) : null),
    enabled: !!coordinates,
  });
}

export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
  return useQuery({
    // coordinates 是 null 時會用 { lat: 0, lon: 0 } 當 key（避免 undefined 出錯）
    queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
    // 如果 coordinates 是 null，就不送請求
    queryFn: () =>
      coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
    enabled: !!coordinates,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: WEATHER_KEYS.search(query),
    queryFn: () => weatherAPI.searchLocations(query),
    enabled: query.length >= 3,
  });
}
