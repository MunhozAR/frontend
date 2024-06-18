import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Services.css"

function Services() {
    const [nome, setNome] = useState("");
    const [tarefa, setTarefa] = useState("");
    const [descricao, setDescricao] = useState("");
    const [entrega, setEntrega] = useState(false);
    const [dataDeEntrega, setDataDeEntrega] = useState("");
    const [tarefas, setTarefas] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [token, setToken] = useState(null); // State to store the token

    const getToken = () => {
        // Implement logic to retrieve token from local storage, cookies, or authentication service
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const criarTarefa = {
            nome,
            tarefa: parseInt(tarefa, 10), // Convert to integer
            descricao,
            entrega,
            data_de_entrega: parseInt(dataDeEntrega, 10), // Convert to integer
        };
        console.log('Dados enviados:', criarTarefa);

        if (!token) {
            setErrorMessage("Token não disponível. Por favor, faça login.");
            return; // Prevent sending request without token
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Add token to Authorization header
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await axios.post("http://localhost:3001/tarefa", criarTarefa, config);
            console.log("Nova Tarefa:", response.data);
            fetchTarefas(); // Update the task list
            // Reset form fields
            setNome("");
            setTarefa("");
            setDescricao("");
            setEntrega(false);
            setDataDeEntrega("");
            setErrorMessage("");
        } catch (error) {
            if (error.response && error.response.data) {
                console.error("Erro ao criar a tarefa:", error.response.data.message);
                console.error("Detalhes dos erros:", error.response.data.errors);
                setErrorMessage(error.response.data.message);
            } else {
                console.error("Erro ao criar a tarefa:", error.message);
                setErrorMessage(error.message);
            }
        }
    };

    const fetchTarefas = async () => {
        try {
            const response = await axios.get("http://localhost:3001/tarefa");
            setTarefas(response.data);
        } catch (error) {
            console.error("Erro ao buscar as tarefas:", error);
        }
    };

    const updateTarefa = async (id, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:3001/tarefa/${id}`, updatedData, config);
            console.log("Tarefa atualizada:", response.data);
            fetchTarefas(); // Update the task list
        } catch (error) {
            console.error("Erro ao atualizar a tarefa:", error);
        }
    };

    const deleteTarefa = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/tarefa/${id}`, config);
            console.log("Tarefa deletada");
            fetchTarefas(); // Update the task list
        } catch (error) {
            console.error("Erro ao deletar a tarefa:", error);
        }
    };

    useEffect(() => {
        getToken(); // Get token on initial render
        fetchTarefas();
    }, []);

    return (
        <div className="tarefa-form-container">
            <h2>Criação de Tarefas</h2>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <label>Nome:</label>
                <input
                    id="text-name"
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />
                <label>Tarefa:</label>
                <input
                    id="text-number"
                    type="number"
                    name="tarefa"
                    value={tarefa}
                    onChange={(event) => setTarefa(event.target.value)}
                />
                <label>Descrição:</label>
                <textarea
                    id="text-descricao"
                    name="descricao"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                />
                <label>Entrega:</label>
                <select
                    id="text-entrega"
                    name="entrega"
                    value={entrega}
                    onChange={(event) => setEntrega(event.target.value === 'true')}
                >
                    <option value={true}>Sim</option>
                    <option value={false}>Não</option>
                </select>
                <label>Data de Entrega:</label>
                <input
                    id="text-data"
                    name="data_de_entrega"
                    type="text"
                    value={dataDeEntrega}
                    onChange={(event) => setDataDeEntrega(event.target.value)}
                />
                {token ? (  // Conditionally render submit button only if token exists
                    <button id="send-work" type="submit">Criar Tarefa</button>
                ) : (
                    <p>É necessário estar logado para criar tarefas.</p>
                )}
            </form>
            <h2>Lista de Tarefas</h2>
            <ul>
                {tarefas.map((tarefa) => (
                    <li key={tarefa.tarefa}>
                        {tarefa.nome} - {tarefa.tarefa} - {tarefa.descricao} - {tarefa.entrega ? 'Sim' : 'Não'} - {tarefa.data_de_entrega}
                        <button onClick={() => updateTarefa(tarefa.tarefa, { descricao: "Descrição Atualizada", entrega: true, data_de_entrega: 20241231 })}>Atualizar</button>
                        <button onClick={() => deleteTarefa(tarefa.tarefa)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Services;
