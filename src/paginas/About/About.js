import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material"
import "./About.css";

const About = () => {
    const [formData, setFormData] = useState({
        nome: "",
        ano: "",
        sala: "",
        userUsuario: "",
        senha: "", // New field for password
    });

    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await axios.put(`http://localhost:3001/turma/${editId}`, formData);
            } else {
                await axios.post("http://localhost:3001/turma", formData);
            }
            alert("Dados enviados com sucesso!");
            setFormData({
                nome: "",
                ano: "",
                sala: "",
                userUsuario: "",
                senha: "", // Clear password field after submit
            });
            setEditId(null);
            fetchData();
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
        }
    };

    const fetchData = async () => {
        try {
            const result = await axios.get("http://localhost:3001/turma");
            setData(result.data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    const handleEdit = (user) => {
        setFormData(user);
        setEditId(user.turma);
    };

    const handleDelete = async (id) => {
        try {
            console.log(`http://localhost:3001/turma/${id}`);
            await axios.delete(`http://localhost:3001/turma/${id}`);
            fetchData();
        } catch (error) {
            console.error("Erro ao deletar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        id="text-nome"
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Ano:</label>
                    <input
                        id="text-ano"
                        type="number"
                        name="ano"
                        value={formData.ano}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Sala:</label>
                    <input
                        id="text-sala"
                        type="text"
                        name="sala"
                        value={formData.sala}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Usuário:</label>
                    <input
                        id="text-usuario"
                        type="text"
                        name="userUsuario"
                        value={formData.userUsuario}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        id="text-senha"
                        type="password" // Password field should be hidden
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                    />
                </div>
                <Button id="" variant="contained" type="submit">{editId ? "Atualizar" : "Enviar"}</Button>
            </form>
            <ul>
                {data.map((user) => (
                    <li key={user.turma}>
                        {user.nome} - {user.senha} - {user.ano} - {user.sala} -{" "}
                        {user.userUsuario}
                        <button onClick={() => handleEdit(user)}>Editar</button>
                        <button onClick={() => handleDelete(user.turma)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default About;