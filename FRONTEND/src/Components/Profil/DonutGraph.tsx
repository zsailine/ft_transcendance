import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface WinLossChartProps {
    wins: number;
    losses: number;
}

const WinLossChart: React.FC<WinLossChartProps> = ({ wins, losses }) => {
    
    const data = {
        labels: ["Wins", "Losses"],
        datasets: [
            {
                data: [wins, losses],
                backgroundColor: [
                    "rgba(0, 181, 216, 1)", 
                    "rgba(255, 99, 132, 0.7)"
                ],
                borderColor: [
                    "rgba(2, 118, 140, 1)",
                    "rgba(255, 99, 132, 1)"
                ],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        cutout: "60%",
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
    };

    return (
        <div style={{ width: "300px", margin: "auto" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default WinLossChart;
