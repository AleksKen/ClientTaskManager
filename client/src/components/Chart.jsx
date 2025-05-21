import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell} from 'recharts';

const Chart = ({chartData}) => {
    const colors = ['#df7eb7', '#d8a163', '#82bdca', '#4d7ced'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Bar dataKey="total">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};


export default Chart