import { FiSlack } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs } from 'firebase/firestore';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart, Bar } from 'recharts';

export default function Graphs() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const snapshot = await getDocs(collection(db, 'chamados'));
                let statusCount = {
                    'Aberto': 0,
                    'Progresso': 0,
                    'Atendido': 0,
                };

                snapshot.forEach(doc => {
                    const chamado = doc.data();
                    statusCount[chamado.status] += 1; // Incrementa o contador do status correspondente
                });

                const chartData = Object.keys(statusCount).map(status => ({
                    status: status,
                    count: statusCount[status],
                }));

                setData(chartData);
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            }
        }

        loadData();
    }, []);

    // Mapeamento de status para cores
    const statusColors = {
        'Aberto': '#8884d8',
        'Fechado': '#82ca9d',
        'Em andamento': '#ffc658',
    };

    // Gráfico de Barras (Quantidade de chamados por status)
    const barCharts = (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="status" />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="count"
                    fill={({ payload }) => statusColors[payload.status]}
                    label={{ position: 'right', fill: '#000' }} // Mostra a quantidade de chamados no gráfico
                />
            </BarChart>
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
                            <h3>Distribuição de Status</h3>
                            {barCharts}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
