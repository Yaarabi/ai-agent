"use client";
import { motion } from "framer-motion";
import {
    Line, Bar, Pie, Doughnut, Radar
} from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import {
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    ArcElement, RadialLinearScale, Tooltip, Legend, Title
} from "chart.js";

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    ArcElement, RadialLinearScale, Tooltip, Legend, Title,
    MatrixController, MatrixElement
);

const charts = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar
};

export const Chart = ({ chartType, data, options }) => {
    const ChartComponent = charts[chartType];

    if (!ChartComponent) {
        return (
        <div className="text-red-500 text-center mt-4">
            Unsupported chart type: <strong>{chartType}</strong>
        </div>
        );
    }

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
            width: '100%',
            maxWidth: '800px',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '10px',
            background: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        >
        <ChartComponent data={data} options={options} />
        </motion.div>
    );
};
