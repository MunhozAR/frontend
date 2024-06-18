import React, { useState, useEffect } from "react";
import axios from "axios";

const About = () => {
    const [formData, setFormData] = useState({
        nome: "",
        ano: 0,
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

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token não disponível. Por favor, faça login.");
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const jsondata = {
            nome: formData.nome,
            ano: formData.ano,
            sala: formData.sala,
            userUsuario: formData.userUsuario,
            senha: formData.senha, // New field for password
        };

        try {
            if (editId) {
                await axios.put(`http://localhost:3001/turma/${editId}`, jsondata, config);
            } else {
                const response = await axios.post("http://localhost:3001/turma", jsondata, config);
                console.log("Resposta da API:", response.data);
            }
            alert("Dados enviados com sucesso!");
            setFormData({
                nome: "",
                ano: 0,
                sala: "",
                userUsuario: "",
                senha: "", // Clear password field after submit
            });
            setEditId(null);
            fetchData();
        } catch (error) {
            if (error.response) {
                console.error("Erro ao enviar dados:", error.response.status, error.response.data);
            } else {
                console.error("Erro ao enviar dados:", error.message);
            }
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
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Ano:</label>
                    <input
                        type="number"
                        name="ano"
                        value={formData.ano}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Sala:</label>
                    <input
                        type="text"
                        name="sala"
                        value={formData.sala}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>User Usuário:</label>
                    <input
                        type="text"
                        name="userUsuario"
                        value={formData.userUsuario}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Senha:</label>
                    <input
                        type="password" // Password field should be hidden
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">{editId ? "Atualizar" : "Enviar"}</button>
            </form>
            <ul>
                {data.map((user) => (
                    <li key={user.turma}>
                        {user.nome} - {user.senha} - {user.ano} - {user.sala} - {user.userUsuario}
                        <button onClick={() => handleEdit(user)}>Editar</button>
                        <button onClick={() => handleDelete(user.turma)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default About;
