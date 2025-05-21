import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, Title, Tooltip, Legend);

const PieChart = ({ chartData }) => {
    const data = {
        labels: chartData.map(item => item.name),
        datasets: [
            {
                data: chartData.map(item => item.total),
                backgroundColor: ['#0f13ff', '#07086f', '#2dd3ff', '#090b91'],
                borderWidth: 0,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            }
        },
        cutout: '60%',
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
