import { Coordinates } from "@/api/types";
import { useEffect, useState } from "react";

interface GeolocationState {
  coordinates: Coordinates | null;
  error: string | null;
  isLoading: boolean;
}
export function useGeolocation() {
  const [locationData, setLocationData] = useState<GeolocationState>({
    coordinates: null,
    error: null,
    isLoading: true,
  });
  const getLocation = () => {
    // 這裡的 pre 是 React 中 setState 的 updater function 提供的 「前一個狀態值」。
    // ...pre：先把之前的整個 locationData 狀態複製過來。
    // 然後覆蓋掉裡面的 isLoading 和 error。
    // 保留其他（像是 coordinates）不變。
    // 這樣寫的目的是：
    // 不會把整個 locationData 蓋掉，只改你想改的欄位而已。
    setLocationData((pre) => ({ ...pre, isLoading: true, error: null }));
    if (!navigator.geolocation) {
      setLocationData({
        coordinates: null,
        error: "Geolocation is not supported by your brower",
        isLoading: false,
      });
      return;
    }
    // navigator 是瀏覽器內建的全域物件之一。
    // 你可以在任何瀏覽器 JavaScript 環境中直接使用 navigator，它代表的是使用者的瀏覽器資訊。
    // geolocation API，用來取得使用者的地理位置。
    // 這個方法有三個參數（第三個是可選）：
    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    // successCallback：成功取得位置時會被呼叫的函數。
    // errorCallback：如果有錯誤，會呼叫這個函數。
    // options：設定（像是是否要高精準度、timeout 時間等）。
    // navigator.geolocation.getCurrentPosition(
    //   (position) => { ... }, // 成功時執行的 callback
    //   (error) => { ... }, // 失敗時執行的 callback
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 5000,
    //     maximumAge: 0,
    //   }
    // );
    // 是說：
    // 若成功取得位置，會把 position 資料傳進來，然後我們就可以使用 position.coords.latitude 和 position.coords.longitude。
    // 若失敗（例如拒絕授權），會傳 error 物件進來。

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          coordinates: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
        }

        setLocationData({
          coordinates: null,
          error: errorMessage,
          isLoading: false,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);
  return {
    ...locationData,
    getLocation,
  };
}
