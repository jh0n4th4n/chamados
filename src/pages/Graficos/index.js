import { FiSlack } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs } from 'firebase/firestore';
import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function Graphs() {
    const [data, setData] = useState([]);

    // Defina um mapeamento de cores por status
    const colors = {
        Atendido: "#8884d8",
        Progresso: "#82ca9d",
        Aberto: "#ffc658",
        quantidade: "#000000"
    };

    useEffect(() => {
        async function fetchData() {
            const chamadosCollection = collection(db, "chamados"); // Coleção de chamados
            const chamadosSnapshot = await getDocs(chamadosCollection);

            // Contar chamados por status
            const statusCount = {};
            chamadosSnapshot.docs.forEach(doc => {
                const status = doc.data().status; // Extrair o status do documento
                if (statusCount[status]) {
                    statusCount[status]++;
                } else {
                    statusCount[status] = 1;
                }
            });

            // Converter para o formato do gráfico
            const chartData = Object.keys(statusCount).map(status => ({
                name: status,    // O nome será o status (ex: "concluido", "pendente")
                quantidade: statusCount[status], // O valor será o número de chamados com esse status
            }));

            setData(chartData);
        }

        fetchData();
    }, []);

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
                            <ResponsiveContainer width={500} height={500}>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    {/* Removendo o YAxis para ocultar a coluna lateral */}
                                    <XAxis dataKey="name" />
                                    <Tooltip />
                                    {/* Legenda que usará as mesmas cores que as barras */}
                                    <Legend formatter={(value) => <span style={{ color: colors[value] }}>{value}</span>} />
                                    <Bar dataKey="quantidade">
                                        {
                                            data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                                            ))
                                        }
                                        {/* Exibir valores em cima das barras */}
                                        <LabelList dataKey="quantidade" position="top" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
