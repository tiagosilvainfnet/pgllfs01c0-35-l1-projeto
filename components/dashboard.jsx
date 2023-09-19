import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import useSWR from 'swr';
import { io } from "socket.io-client";
import { ApiClient } from 'adminjs'

const api = new ApiClient()
const socket = io();

ChartJS.register(
    CategoryScale,
    RadialLinearScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
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

export const optionMonth = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Tarefas da Semana'
    }
  }
};
  
const fetcher = (...args) => fetch(...args).then(res => res.json())

const Dashboard = () => {
  const { data: dataTasks } = useSWR("http://localhost:3000/dashboard/tasks/months", fetcher)
  const { data: monthTasks } = useSWR("http://localhost:3000/dashboard/tasks/months/9", fetcher)

  const [message, setMessage] = useState('');

  const loadUser = async () => {
    const data = await api.getDashboard();
    console.log(data)
  }

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      console.log(data)
    });

    loadUser();
  }, []);

  const sendMessage = async () => {
    await socket.emit("SEND_MESSAGE", {
      'user_consumer': 1,
      'user_receptor': 2,
      message
    });
    setMessage('');
  }

  return <>
    <div>{ dataTasks ? <Bar options={options} data={dataTasks.data} /> : "Nada para carregar" }</div>
    <div
      style={{
        width: '50%'
      }}
    >{ monthTasks ? <Radar options={optionMonth} data={monthTasks.data} /> : "Nada para carregar" }</div>

    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    <button onClick={async () => {
      await sendMessage();
    }}>Enviar</button>
  </>
}

export default Dashboard;