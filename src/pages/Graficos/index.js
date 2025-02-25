import { FiSlack } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, LineChart, Line, PieChart, Pie, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import './graficos.css';

const Graphs = () => {
    const [data, setData] = useState([]);
    const [lineData, setLineData] = useState([]);  // Dados para o gráfico de linha (distribuição temporal)
    const [pieData, setPieData] = useState([]);  // Dados para o gráfico de pizza
    const [areaData, setAreaData] = useState([]);  // Dados para o gráfico de área
    const [radarData, setRadarData] = useState([]);  // Dados para o gráfico de radar
    const [sectorData, setSectorData] = useState([]);  // Dados para o ranking de chamados por setor
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
            const sectorCount = {};  // Para o ranking por setor

            chamadosSnapshot.docs.forEach(doc => {
                const status = doc.data().status;
                const createdAt = doc.data().created.toDate();
                const dateString = createdAt.toLocaleDateString();  // Data formatada para o eixo x do gráfico de linha
                const sector = doc.data().cliente;  // Supondo que o campo "setor" exista no Firestore

                // Contagem de status
                statusCount[status] = (statusCount[status] || 0) + 1;

                // Contagem por data para gráfico de linha
                timeSeries[dateString] = (timeSeries[dateString] || 0) + 1;

                // Contagem por setor
                sectorCount[sector] = (sectorCount[sector] || 0) + 1;
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

            const areaChartData = Object.keys(timeSeries).map(date => ({
                name: date,
                quantidade: timeSeries[date],
            }));

            const radarChartData = Object.keys(statusCount).map(status => ({
                subject: status,
                A: statusCount[status],
                fullMark: Math.max(...Object.values(statusCount)),
            }));

            const sectorChartData = Object.keys(sectorCount).map(sector => ({
                name: sector,
                quantidade: sectorCount[sector],
            })).sort((a, b) => b.quantidade - a.quantidade);  // Ordena por quantidade (ranking)

            setData(chartData);
            setLineData(lineChartData);
            setPieData(pieChartData);
            setAreaData(areaChartData);
            setRadarData(radarChartData);
            setSectorData(sectorChartData);

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
                                            margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                                        >
                                            <XAxis
                                                dataKey="name"
                                                label={{
                                                    value: "Status dos Chamados",
                                                    position: "insideBottom",
                                                    offset: -5,
                                                    style: { fontSize: "14px", fill: "#666" }
                                                }}
                                                tick={{ fontSize: 14, fill: "#555" }}
                                            />
                                            <YAxis
                                                label={{
                                                    value: "Quantidade",
                                                    angle: -90,
                                                    position: "insideLeft",
                                                    style: { fontSize: "14px", fill: "#666" }
                                                }}
                                                tick={{ fontSize: 14, fill: "#555" }}
                                            />
                                            <Tooltip
                                                cursor={{ fill: "rgba(200, 200, 200, 0.2)" }}
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    borderRadius: "8px",
                                                    border: "1px solid #ddd",
                                                    padding: "10px"
                                                }}
                                            />
                                            <Bar dataKey="quantidade" radius={[8, 8, 0, 0]} barSize={50}>
                                                {data.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={`url(#gradient-${entry.name})`}
                                                    />
                                                ))}
                                                <LabelList dataKey="quantidade" position="top" fontSize={14} fill="#333" />
                                            </Bar>
                                            <defs>
                                                {Object.keys(colors).map((status) => (
                                                    <linearGradient key={status} id={`gradient-${status}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={colors[status]} stopOpacity={0.8} />
                                                        <stop offset="100%" stopColor={colors[status]} stopOpacity={0.5} />
                                                    </linearGradient>
                                                ))}
                                            </defs>
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
                                    <h3>Distribuição de Chamados por Status (Área)</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <AreaChart
                                            data={areaData}
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
                                            <Area type="monotone" dataKey="quantidade" stroke="#8884d8" fill="#8884d8" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <h3>Distribuição de Chamados por Status (Radar)</h3>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RadarChart outerRadius={150} data={radarData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis />
                                            <Radar name="Chamados" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="chart-container">
                                    <h3>Distribuição de Chamados por Status (Pizza)</h3>
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

                                <div className="chart-container">
                                    <h3>Ranking de Chamados por Setor Profissional</h3>
                                    <ResponsiveContainer width="100%" height={700}>
                                        <BarChart
                                            data={sectorData}
                                            layout="vertical"
                                            margin={{
                                                top: 30,
                                                right: 150, // Espaço para os rótulos das barras
                                                left: 10,   // Espaço mínimo à esquerda
                                                bottom: 20,
                                            }}
                                            barGap={20} // Maior espaço entre as barras
                                        >
                                            <XAxis
                                                type="number"
                                                label={{ value: "Quantidade", position: "insideBottom", offset: -5 }}
                                                tick={{ fill: "#333" }} // Cor do texto do eixo X
                                            />
                                            <YAxis
                                                type="category"
                                                dataKey="name"
                                                tick={{
                                                    fill: "#333",
                                                    fontSize: 12, // Reduzindo o tamanho da fonte
                                                    wordBreak: "break-word", // Quebra de texto para evitar sobreposição
                                                }}
                                                width={250} // Aumentando a largura do eixo Y para caber nomes longos
                                                interval={0} // Exibir todos os nomes sem ocultação
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "5px",
                                                    padding: "10px",
                                                }}
                                                formatter={(value) => [`Quantidade: ${value}`]} // Personalizar o texto do tooltip
                                            />
                                            <Bar
                                                dataKey="quantidade"
                                                fill="#8884d8"
                                                radius={[10, 10, 0, 0]}
                                                barSize={30} // Reduzir tamanho das barras para melhorar espaçamento
                                            >
                                                {sectorData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={["#82ca9d", "#ffc658", "#8884d8", "#ff8042", "#00C49F"][index % 5]} // Cores distintas para cada barra
                                                    />
                                                ))}
                                                <LabelList
                                                    dataKey="quantidade"
                                                    position="right"
                                                    fill="#333"
                                                    fontSize={14}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>



                                <div className="chart-container">
                                    <h3>Quantitativo de Chamados por Setor</h3>
                                    <div className="sector-list">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Setor</th>
                                                    <th>Quantidade de Chamados</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sectorData.map((sector, index) => (
                                                    <tr key={index}>
                                                        <td>{sector.name}</td>
                                                        <td>{sector.quantidade}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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