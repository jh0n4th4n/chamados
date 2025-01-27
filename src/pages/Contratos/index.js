import { FiFileText } from "react-icons/fi";
import Header from "../../components/Header";
import Title from "../../components/Title";


export default function Contratos() {
    return (
        <>

            <Header />
            <div className="content">
                <Title name="Contratos">
                    <FiFileText size={25} />
                </Title>
                <hr />

                <div className="container">
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Número do Contrato</th>
                                    <th>Cliente</th>
                                    <th>Data de Início</th>
                                    <th>Data de Término</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>123456</td>
                                    <td>Cliente A</td>
                                    <td>01/01/2022</td>
                                    <td>31/12/2022</td>
                                    <td>
                                        <button>Visualizar</button>
                                        <button>Editar</button>
                                        <button>Excluir</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="content">

            </div>

        </>
    )
}