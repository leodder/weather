import { API_CONFIG } from "./config";
import type {
  WeatherData,
  ForecastData,
  GeocodingResponse,
  Coordinates,
} from "./types";

// api calling without axios to learn
class WeatherAPI {
  // private 是類別的存取修飾詞（access modifier），表示這個方法只能在 class 內部使用，不能從外部調用。
  // Ex:
  // const api = new WeatherAPI();
  // api.createUrl(...) ❌ // 會報錯：因為是 private

  private createUrl(endpoint: string, params: Record<string, string | number>) {
    // Record<string, string | number>
    // Record<K, V> 是一個內建泛型型別，表示「一個物件，key 為 K，value 為 V」
    // 這裡意思是：
    // {[key: string]: string | number}
    // Ex:
    // const params = {
    //   lat: 25.0,
    //   lon: 121.5,
    //   q: "Tokyo"
    // }
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      // spread operator is to 這樣就能把所有傳入的參數合併到 URLSearchParams 裡，同時加上 appid。
      ...params,
    });
    return `${endpoint}?${searchParams.toString()}`;
  }
  // <T>、Promise<T>、fetchData<T>是 泛型（Generic） 概念。
  // TS 中加 <T> 的好處是：你可以決定你要回傳什麼型別
  // Ex:
  // this.fetchData<WeatherData>(url) // 指定這次是要拿 WeatherData 的資料
  // this.fetchData<GeocodingResponse[]>(url) // 指定這次是陣列的地理資料
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }
    return response.json();
  }
  // Promise<WeatherData> 是什麼意思？
  // 這個函式是 async 非同步函式，回傳的是一個 Promise， 最終解析出來的結果會是 WeatherData 的型別
  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    // this.fetchData<WeatherData>(url) 是什麼？
    // 這是在 class 裡呼叫自己定義的泛型方法，並指定返回資料格式。
    // 意思是：「用 fetch 去拿資料，拿到的東西是 WeatherData 型別」，這樣 TypeScript 就能幫你檢查格式對不對，IDE 也會幫你補提示！
    return this.fetchData<WeatherData>(url);
  }
  // reverseGeocode({ lat, lon }: Coordinates): Promise<GeocodingResponse[]>
  // 這裡用了兩個技巧，一起拆解：
  // 1. { lat, lon }: Coordinates 是參數解構 + 型別定義
  // 2. Promise<GeocodingResponse[]> 是回傳一個「地理座標陣列」
  // 因為這個 API 是查地點用的，有可能回傳多個結果（例如 "Taipei" 會有台灣的也可能有美國的）
  async getForecast({ lat, lon }: Coordinates): Promise<ForecastData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.units,
    });
    return this.fetchData<ForecastData>(url);
  }
  async reverseGeocode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }
  async searchLocations(query: string): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/direct`, {
      q: query,
      limit: "5",
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();
