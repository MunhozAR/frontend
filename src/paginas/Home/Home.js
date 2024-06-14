import React, { useState, useEffect } from "react";
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@mui/material";
import axios from "axios";

function Home() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [users, setUsers] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/user", {
                nome,
                email,
                senha,
            });
            console.log("Resposta:", response.data);
            fetchUsers(); // Atualiza a lista de usuários
        } catch (error) {
            console.error("Erro ao enviar os dados:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3001/user");
            setUsers(response.data);
        } catch (error) {
            console.error("Erro ao buscar os dados:", error);
        }
    };

    const updateUser = async (id, updatedData) => {
        try {
            const response = await axios.put(`http://localhost:3001/user/${id}`, updatedData);
            console.log("Usuário atualizado:", response.data);
            fetchUsers(); // Atualiza a lista de usuários
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/user/${id}`);
            console.log("Usuário deletado");
            fetchUsers(); // Atualiza a lista de usuários
        } catch (error) {
            console.error("Erro ao deletar o usuário:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Container maxWidth="sm">
            <Typography variant="h1" id="text-home">
                Bem-vindo ao Estude Fácil
            </Typography>
            <Typography variant="body1" id="body-home">
            Nós somos o Estude Fácil. Somos um site para ajudar na conexão e organização entre alunos e professores.
            Crie uma sala como professor ou entre uma como aluno. Bons Estudos!
            </Typography>
            <Typography variant="h2" id="login-home">Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                />
                <TextField
                    type="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                    type="password"
                    label="Senha"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Entrar
                </Button>
            </form>
            <Typography id="user-list" variant="h2" >Lista de Usuários</Typography>
            <List>
                {users.map((user) => (
                    <ListItem key={user.usuario}>
                        <ListItemText primary={`${user.nome} - ${user.email}`} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => updateUser(user.usuario, { nome: "Nome Atualizado", email: "email@atualizado.com" })}>
                                Atualizar
                            </IconButton>
                            <IconButton onClick={() => deleteUser(user.usuario)}>
                                Deletar
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

export default Home;

