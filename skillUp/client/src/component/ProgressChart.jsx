import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#f87171"]; // green, red

export default function ProgressChart({ tasks }) {
  const completedCount = tasks.filter(task => task.completed).length;
  const incompleteCount = tasks.length - completedCount;

  const data = [
    { name: "Completed", value: completedCount },
    { name: "Incomplete", value: incompleteCount },
  ];

  if (tasks.length === 0) return null;

  return (
    <div className="w-full md:w-1/2 mx-auto mb-6">
      <h2 className="text-lg font-semibold text-center mb-2">Progress Overview</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
