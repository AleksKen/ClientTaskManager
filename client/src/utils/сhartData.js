export const getChartData = (tasks) => {
    const priorities = ["High", "Medium", "Normal", "Low"];

    const chartData = priorities.map(priority => ({
        name: priority,
        total: 0
    }));

    tasks?.forEach(task => {
        const priorityIndex = chartData.findIndex(item => item.name.toLowerCase() === task.priority);
        if (priorityIndex !== -1) {
            chartData[priorityIndex].total += 1;
        }
    });

    return chartData;
};

