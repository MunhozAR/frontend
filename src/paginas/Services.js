import React, { useState, useEffect } from "react";
import axios from "axios";

function Services() {
    const [nome, setNome] = useState("");
    const [tarefa, setTarefa] = useState("");
    const [descricao, setDescricao] = useState("");
    const [entrega, setEntrega] = useState(false);
    const [dataDeEntrega, setDataDeEntrega] = useState("");
    const [tarefas, setTarefas] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const criarTarefa = {
            nome,
            tarefa: parseInt(tarefa, 10), // Convert to integer
            descricao,
            entrega,
            data_de_entrega: parseInt(dataDeEntrega, 10), // Convert to integer
        };
        console.log('Dados enviados:', criarTarefa); // Log the data being sent
        try {
            const response = await axios.post("http://localhost:3001/tarefa", criarTarefa);
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
            const response = await axios.put(`http://localhost:3001/tarefa/${id}`, updatedData);
            console.log("Tarefa atualizada:", response.data);
            fetchTarefas(); // Update the task list
        } catch (error) {
            console.error("Erro ao atualizar a tarefa:", error);
        }
    };

    const deleteTarefa = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/tarefa/${id}`);
            console.log("Tarefa deletada");
            fetchTarefas(); // Update the task list
        } catch (error) {
            console.error("Erro ao deletar a tarefa:", error);
        }
    };

    useEffect(() => {
        fetchTarefas();
    }, []);

    return (
        <div className="tarefa-form-container">
            <h2>Criação de Tarefas</h2>
            <form onSubmit={handleSubmit}>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <label>Nome:</label>
                <input 
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />
                <label>Tarefa:</label>
                <input
                    type="number"
                    name="tarefa"
                    value={tarefa}
                    onChange={(event) => setTarefa(event.target.value)}
                />
                <label>Descrição:</label>
                <textarea
                    name="descricao"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                />
                <label>Entrega:</label>
                <select
                    name="entrega"
                    value={entrega}
                    onChange={(event) => setEntrega(event.target.value === 'true')}
                >
                    <option value={true}>Sim</option>
                    <option value={false}>Não</option>
                </select>
                <label>Data de Entrega:</label>
                <input
                    name="data_de_entrega"
                    type="number"
                    value={dataDeEntrega}
                    onChange={(event) => setDataDeEntrega(event.target.value)}
                />
                <button type="submit">Criar Tarefa</button>
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
