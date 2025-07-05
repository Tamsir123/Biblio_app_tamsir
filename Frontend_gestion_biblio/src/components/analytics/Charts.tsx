import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TrendChartProps {
  data: Array<{
    date: string;
    emprunts: number;
    retours: number;
  }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
        />
        <YAxis fontSize={12} />
        <Tooltip 
          labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
          formatter={(value, name) => [value, name === 'emprunts' ? 'Emprunts' : 'Retours']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="emprunts" 
          stroke="#3B82F6" 
          strokeWidth={2}
          name="Emprunts"
        />
        <Line 
          type="monotone" 
          dataKey="retours" 
          stroke="#10B981" 
          strokeWidth={2}
          name="Retours"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface ActivityChartProps {
  data: Array<{
    hour: string;
    activity: number;
  }>;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="hour" 
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="activity" 
          stroke="#8B5CF6" 
          fill="#8B5CF6"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface PopularBooksChartProps {
  data: Array<{
    title: string;
    borrowCount: number;
  }>;
}

export const PopularBooksChart: React.FC<PopularBooksChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" fontSize={12} />
        <YAxis 
          type="category" 
          dataKey="title" 
          fontSize={10}
          width={120}
        />
        <Tooltip />
        <Bar dataKey="borrowCount" fill="#F59E0B" />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface CategoryChartProps {
  data: Array<{
    genre: string;
    count: number;
    color: string;
  }>;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ genre, percent }) => `${genre}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

interface BorrowingStatsChartProps {
  data: Array<{
    month: string;
    emprunts: number;
    retards: number;
  }>;
}

export const BorrowingStatsChart: React.FC<BorrowingStatsChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Legend />
        <Bar dataKey="emprunts" fill="#3B82F6" name="Emprunts" />
        <Bar dataKey="retards" fill="#EF4444" name="Retards" />
      </BarChart>
    </ResponsiveContainer>
  );
};
