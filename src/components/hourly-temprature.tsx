import type { ForecastData } from "@/api/types";
// import { ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

interface HourlyTempratureProps {
  data: ForecastData;
}
// to learn bg-background text-muted-foreground shadow-sm grid grid-cols-2 flex-1 Recharts 
const HourlyTemprature = ({ data }: HourlyTempratureProps) => {
  const chartData = data.list.slice(0, 8).map((item) => ({
    // to learn: 為何需要用new這個語法？ slice
    time: format(new Date(item.dt * 1000), "ha"),
    // Math.round?
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));
  // console.log(data.list.slice(0, 8));
  // console.log(chartData);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's temprature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width={"100%"} height={"100%"}>
            {/* https://recharts.org/en-US/guide/getting-started */}
            <LineChart data={chartData}>
              {/* XAsis & YAxis are a liitl weird */}
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              {/* tooltip */}
              {/* https://recharts.org/en-US/api/Tooltip */}
              <Tooltip
                content={({ active, payload }) => {
                  // console.log(active);
                  // console.log(payload);
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temprature{" "}
                            </span>
                            <span className="font-bold">
                              {payload[0]?.value}°
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Feels like{" "}
                            </span>
                            <span className="font-bold">
                              {payload[1]?.value}°
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={true}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#64748b"
                strokeWidth={2}
                dot={true}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemprature;
