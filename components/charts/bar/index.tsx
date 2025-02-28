import { ChartColours } from "../colours";
import { BarItem } from "./section";

type BarChartItem = {
    label: string;
    value: number;
    toolTipContent?: React.ReactNode;
};

interface BarChartProps {
    data: BarChartItem[];
    maxValue?: number;
};

const BarChart = ({ data, maxValue }: BarChartProps) => {
    const effectiveMaxValue = maxValue || Math.max(...data.map(item => item.value));
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row w-full h-[200px] items-end">
                {data.length === 0 &&
                    <BarItem
                        data={{
                            label: "Invest in a swarm to see a breakdown",
                            value: 1,
                            toolTipContent: undefined,
                        }}
                        colour="bg-gray-200/10"
                    />
                }
                {data.map((item, index) => {
                    // Drastically reduced max height to 25% of container
                    const percentage = Math.min(
                        25, // Maximum height reduced from 60% to 25%
                        Math.max(
                            5, // Minimum height reduced from 10% to 5%
                            (item.value / effectiveMaxValue) * 25 // Scale to max 25% of container height
                        )
                    );
                    
                    return (
                        <BarItem
                            data={item}
                            key={index}
                            className="min-w-[5%]"
                            style={{
                                height: `${percentage}%`
                            }}
                            colour={ChartColours[index]}
                        />
                    );
                })}
            </div>
            <div className="flex flex-row gap-4 flex-wrap">
                {data.length === 0 &&
                    <p className="flex flex-row items-center gap-2 whitespace-nowrap truncate text-muted">
                        <span className="w-3 h-3 rounded-full aspect-square bg-gray-200/10"></span>
                        N/A
                    </p>
                }
                {data.map((item, index) => {
                    return (
                        <p key={index} className="flex flex-row items-center gap-2 whitespace-nowrap truncate">
                            <span className={`w-3 h-3 rounded-full aspect-square ${ChartColours[index]}`}></span>
                            {item.label}
                        </p>
                    )
                })}
            </div>
        </div>
    );

};

export { BarChart };
export type { BarChartProps, BarChartItem };
