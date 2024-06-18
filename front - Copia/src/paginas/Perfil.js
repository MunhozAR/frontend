import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    CircularProgress,
    Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

function Perfil() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState({}); // Estado para controlar a expansão das filiações

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Recupera o token do localStorage
                const token = localStorage.getItem("token");

                // Configura os headers para a requisição com o token
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                console.log("token", token);

                // Faz a requisição com o header de autenticação
                const response = await axios.get("http://localhost:3001/user", config);
                setUsers(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Recurso não encontrado (404).");
                } else {
                    setError("Erro ao carregar os dados.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleClick = (userId) => {
        setOpen((prevOpen) => ({ ...prevOpen, [userId]: !prevOpen[userId] }));
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box p={2}>
            <Typography variant="h4" gutterBottom>
                Lista de Usuários
            </Typography>
            <List>
                {users.map((user) => (
                    <React.Fragment key={user.id_user}>
                        <ListItem button onClick={() => handleClick(user.id_user)}>
                            <ListItemText primary={user.nome} secondary={user.email} />
                            {open[user.id_user] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open[user.id_user]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {user.filiacoes.length > 0 ? (
                                    user.filiacoes.map((filiacao) => (
                                        <ListItem key={filiacao.id_perfil} sx={{ pl: 4 }}>
                                            <ListItemText
                                                primary={filiacao.nome}
                                                secondary={`${filiacao.endereco}, ${filiacao.bairro}, ${filiacao.cidade} - ${filiacao.uf}`}
                                            />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem sx={{ pl: 4 }}>
                                        <ListItemText primary="Sem filiações" />
                                    </ListItem>
                                )}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}

export default Perfil;