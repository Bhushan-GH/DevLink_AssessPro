import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Box, Typography } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface Resource {
  _id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string;
  status: string;
  createdAt: string;
}

interface AnalyticsDashboardProps {
  resources: Resource[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ resources }) => {
  // Count by status
  const statusCounts = resources.reduce(
    (acc, resource) => {
      acc[resource.status] = (acc[resource.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Count by category
  const categoryCounts = resources.reduce(
    (acc, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusLabels = ['watching', 'reading', 'done'];
  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Resource Status',
        data: statusLabels.map(label => statusCounts[label] || 0),
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      },
    ],
  };

  const categoryLabels = Object.keys(categoryCounts);
  const categoryData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryLabels.map(label => categoryCounts[label]),
        backgroundColor: [
          '#ffeb3b', '#ff9800', '#f44336', '#4caf50', '#2196f3', '#9c27b0', '#00bcd4',
          '#e91e63', '#795548', '#607d8b' // expand as needed
        ],
      },
    ],
  };

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,     // 🧠 Ensures no decimals
        stepSize: 1,      // 🧠 Optional, force step size of 1
      },
    },
  },
};


  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap', mt: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Resource Status
          </Typography>
          <Box sx={{ height: 250, width: 250 }}>
            <Bar data={statusData} options={chartOptions} />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            Resource Categories
          </Typography>
          <Box sx={{ height: 250, width: 250 }}>
            <Pie data={categoryData} options={chartOptions} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AnalyticsDashboard;


