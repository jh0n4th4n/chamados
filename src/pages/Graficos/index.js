import { FiSlack } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { useState, useEffect } from 'react';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import './graficos.css';


export default function Graphs() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(''); // Data inicial
    const [endDate, setEndDate] = useState(''); // Data final

    // Defina um mapeamento de cores por status
    const colors = {
        Atendido: "#8884d8",
        Progresso: "#82ca9d",
        Aberto: "#ffc658",
        quantidade: "#000000"
    };

    const fetchData = async (start, end) => {
        const chamadosCollection = collection(db, "chamados");
        let q = query(chamadosCollection);

        // Filtrar por data se as datas de início e fim estiverem definidas
        if (start && end) {
            q = query(chamadosCollection, where("created", ">=", new Date(start)), where("created", "<=", new Date(end)));
        }

        const chamadosSnapshot = await getDocs(q);
        
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
            name: status,    
            quantidade: statusCount[status], 
        }));

        setData(chartData);
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]); // Chama a função sempre que as datas mudarem

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

                        <div className="chart-container">
                            <ResponsiveContainer width={500} height={500}>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{
                                        top: 30,
                                        right: 30,
                                        left: 30,
                                        bottom: 30,

                                    }}
                                >
                                    <XAxis dataKey="name" />
                                    <Tooltip />
                                    <Bar dataKey="quantidade">
                                        {
                                            data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                                            ))
                                        }
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
