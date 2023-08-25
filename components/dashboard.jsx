import React from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import faker from 'faker';
import useSWR from 'swr';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Tarefas por mês',
    },
  },
};
  
const fetcher = (...args) => fetch(...args).then(res => res.json())

const Dashboard = () => {
  const { data: dataTasks } = useSWR("http://localhost:3000/dashboard/tasks", fetcher)

  return dataTasks ? <Bar options={options} data={dataTasks.data} /> : "Nada para carregar"
}

export default Dashboard;