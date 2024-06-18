import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';
import '../../LoginStyles.css';

function Login() {
    // Declaração dos estados usando useState
    const [email, setEmail] = useState("");  // Estado para armazenar o email
    const [senha, setSenha] = useState(""); // Estado para armazenar a senha
    const [error, setError] = useState("");  // Estado para armazenar mensagens de erro

    // Função para lidar com o login
    const handleLogin = async () => {
        try {
            // Envia uma requisição POST para o endpoint de login da API
            const response = await axios.post("http://localhost:3001/auth/login", {
                email,  // Passa o estado do email
                senha,
         // Passa o estado da senha
            });

            // Envia uma mensagem para o console com a resposta da API
            console.log("Login realizado com sucesso:", response.data);

            // Verifica se a resposta contém o token de acesso
            const token = response.data?.access_token;
            if (token) {
                // Armazena o token no localStorage
                localStorage.setItem("token", response.data.access_token);
                // Envia uma mensagem para o console com o valor do token armazenado
                console.log("Token armazenado:", localStorage.getItem("token"));
            } else {
                // Lança um erro se o token não estiver presente na resposta
                throw new Error("Token não encontrado na resposta");
            }

            // Aqui você pode redirecionar o usuário para outra página, se necessário
        } catch (error) {
            // Envia uma mensagem para o console contendo o erro
            console.error("Erro durante o login:", error);

            // Define uma mensagem de erro apropriada no estado
            if (error.response && error.response.status === 404) {
                setError("Credenciais inválidas");
            } else {
                setError(error.message || "Erro ao fazer login");
            }
        }
    };

    return (
        <Box className="login-container">
            <Paper elevation={10} className="login-paper">
                <Typography variant="h5" component="h1" textAlign="center">
                    Login
                </Typography>
                {error && (
                    <Typography variant="body1" color="error" textAlign="center">
                        {error}
                    </Typography>
                )}
                <TextField 
                    label="Usuário"
                    variant="outlined"
                    fullWidth
                    required
                    className="login-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Senha"
                    type="password"
                    variant="outlined"
                    fullWidth
                    required
                    className="login-field"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="login-button"
                    onClick={handleLogin}
                >
                    Entrar
                </Button>
            </Paper>
        </Box>
    );
}

export default Login;