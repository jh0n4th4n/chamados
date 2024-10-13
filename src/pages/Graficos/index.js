import { FiSlack } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection'; // ou outro caminho correto
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';


export default function Graphs() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function loadData() {
            const snapshot = await db.collection('chamados').get();
            let chartData = [];

            snapshot.forEach(doc => {
                const chamado = doc.data();
                chartData.push({
                    date: chamado.created.toDate().toLocaleDateString(), // Data do chamado
                    status: chamado.status, // Status do chamado
                });
            });

            setData(chartData);
        }

        loadData();
    }, []);

    // Gráfico de Linhas (Evolução dos chamados ao longo do tempo)
    const lineChart = (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="status" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );

    // Gráfico de Barras (Quantidade de chamados por status)
    const barChart = (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="status" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );

    // Gráfico de Pizza (Distribuição de status)
    const pieData = [
        { name: 'Aberto', value: data.filter(chamado => chamado.status === 'Aberto').length },
        { name: 'Progresso', value: data.filter(chamado => chamado.status === 'Progresso').length },
        { name: 'Atendido', value: data.filter(chamado => chamado.status === 'Atendido').length }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const pieChart = (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Gráficos">
                    <FiSlack size={25} color="#333" />
                </Title>
                <div className="container">
                    <div className="dashboard">
                        <h2>Dashboard de Chamados</h2>

                        <div className="chart-container">
                            <h3>Evolução dos Chamados</h3>
                            {lineChart}
                        </div>

                        <div className="chart-container">
                            <h3>Chamados por Status</h3>
                            {barChart}
                        </div>

                        <div className="chart-container">
                            <h3>Distribuição de Status</h3>
                            {pieChart}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
