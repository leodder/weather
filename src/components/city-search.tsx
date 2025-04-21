import { useLocationSearch } from "../hooks/use-weather";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "../hooks/use-search-history";
import { format } from "date-fns";
import { useFavorite } from "../hooks/use-favorite";
// to learn split
const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  // console.log(locations);
  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    // add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });
    setOpen(false);
    // console.log(lat);
    // console.log(lon);
    // console.log(name);
    // ⚠️ 注意：value 字串格式一定要正確對應 split 的順序
    // 原本寫成 `${lat} | ${name} | ${country}`，導致拆解時變成：
    // [lat, lon, name, country] = [lat, name, country, undefined]
    // 結果 navigate 的網址參數錯亂，導向錯誤頁面
    // ✅ 正確格式應該是 `${lat} | ${lon} | ${name} | ${country}`
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };
  const { favorites } = useFavorite();

  return (
    <>
      <Button
        variant="outline"
        className="relative justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(!open)}
        // ⚠️ onClick 裡為什麼要用 () => {...}？
        // JSX 的 onClick 需要傳入「一個函式」，不能直接呼叫函式（例如 onClick={handleClick()} ❌）
        // 如果寫 onClick={setOpen(!open)}，會在 render 時就執行 setOpen，造成錯誤
        // 因此要用箭頭函式包起來：onClick={() => setOpen(!open)} ✅
        // 這樣點擊時才會執行 setOpen
      >
        <Search className="mr-2 h-4 w-4" />
        Search cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}
          {/* Favorites Section */}
          {favorites.length > 0 && (
            <CommandGroup heading="Favorites">
              {favorites.map((city) => (
                <CommandItem
                  key={city.id}
                  value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                  onSelect={handleSelect}
                >
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>{city.name}</span>
                  {city.state && (
                    <span className="text-sm text-muted-foreground">
                      , {city.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {city.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">
                    Recent Searches
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                {history.map((location) => (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    // 以下是錯誤寫法， | ，多了空白鍵，導致navigate error
                    // value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {format(location.searchedAt, "MMM d, h:mm a")}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations?.map((location) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                  onSelect={handleSelect}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>{location.name}</span>
                  {location.state && (
                    <span className="text-sm text-muted-foreground">
                      , {location.state}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    , {location.country}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
