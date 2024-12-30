import { FiSlack } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, LineChart, Line, PieChart, Pie, Legend } from 'recharts';
import './graficos.css';

const Graphs = () => {
    const [data, setData] = useState([]);
    const [lineData, setLineData] = useState([]);  // Dados para o gráfico de linha (distribuição temporal)
    const [pieData, setPieData] = useState([]);  // Dados para o gráfico de pizza
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);

    const colors = {
        Atendido: "#82ca9d",
        Progresso: "#ffc658",
        Aberto: "#8884d8",
    };

    const fetchData = async (start, end) => {
        setLoading(true);
        try {
            const chamadosCollection = collection(db, "chamados");
            let q = query(chamadosCollection);

            if (start && end) {
                q = query(chamadosCollection, where("created", ">=", new Date(start)), where("created", "<=", new Date(end)));
            }

            const chamadosSnapshot = await getDocs(q);

            const statusCount = {};
            const timeSeries = {};  // Para a linha temporal
            chamadosSnapshot.docs.forEach(doc => {
                const status = doc.data().status;
                const createdAt = doc.data().created.toDate();
                const dateString = createdAt.toLocaleDateString();  // Data formatada para o eixo x do gráfico de linha

                // Contagem de status
                statusCount[status] = (statusCount[status] || 0) + 1;

                // Contagem por data para gráfico de linha
                timeSeries[dateString] = (timeSeries[dateString] || 0) + 1;
            });

            const chartData = Object.keys(statusCount).map(status => ({
                name: status,
                quantidade: statusCount[status],
            }));

            const lineChartData = Object.keys(timeSeries).map(date => ({
                name: date,
                quantidade: timeSeries[date],
            }));

            const pieChartData = Object.keys(statusCount).map(status => ({
                name: status,
                value: statusCount[status],
            }));

            setData(chartData);
            setLineData(lineChartData);
            setPieData(pieChartData);

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    const handleFilter = () => {
        fetchData(startDate, endDate);
    };

    return (
        <div>
            <Header />
            <div className="content">
                <Title name="Gráficos">
                    <FiSlack size={25} color="#333" />
                </Title>
                <div className="container">
                    <div className="dashboard">
                        <h2 className="subtitulo">Dashboard de Chamados</h2>

                        <div className="divCalendar">
                            <label>Data Inicial:</label>
                            <input
                                className="calendar"
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                            <label>Data Final:</label>
                            <input
                                className="calendar"
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                            <button onClick={handleFilter}>Filtrar</button>
                        </div>

                        {loading ? (
                            <div className="loading">Carregando...</div>
                        ) : (
                            <>
                                <div className="chart-container">
                                    <h3>Distribuição de Chamados por Status</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={data}
                                            margin={{
                                                top: 30,
                                                right: 50,
                                                left: 50,
                                                bottom: 20,
                                            }}
                                        >
                                            <XAxis dataKey="name" label={{ value: "Status dos Chamados", position: "insideBottom", offset: -5 }} />
                                            <YAxis label={{ value: "Quantidade", angle: -90, position: "insideLeft" }} />
                                            <Tooltip />
                                            <Bar dataKey="quantidade" radius={[10, 10, 0, 0]}>
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                                                ))}
                                                <LabelList dataKey="quantidade" position="top" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <h3>Distribuição Temporal de Chamados</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <LineChart
                                            data={lineData}
                                            margin={{
                                                top: 30,
                                                right: 50,
                                                left: 50,
                                                bottom: 20,
                                            }}
                                        >
                                            <XAxis dataKey="name" label={{ value: "Data", position: "insideBottom", offset: -5 }} />
                                            <YAxis label={{ value: "Quantidade", angle: -90, position: "insideLeft" }} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="quantidade" stroke="#8884d8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <h3>Distribuição de Chamados por Status</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={150}
                                                label
                                                labelLine={false}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Graphs;
