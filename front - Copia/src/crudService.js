import React, { useEffect, useState } from "react";
import {
    getItems,
    createItem,
    updateItem,
    deleteItem,
} from "../services/crudService";
import {
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Container,
    Typography,
    Grid,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        nome: "",
        endereco: "",
        cidade: "",
        bairro: "",
        estado: "",
    });
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        const data = await getItems();
        setItems(data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const handleCreateItem = async () => {
        await createItem(newItem);
        setNewItem({
            nome: "",
            endereco: "",
            cidade: "",
            bairro: "",
            estado: "",
        });
        loadItems();
    };

    const handleUpdateItem = async (id) => {
        await updateItem(id, newItem);
        setEditingItem(null);
        setNewItem({
            nome: "",
            endereco: "",
            cidade: "",
            bairro: "",
            estado: "",
        });
        loadItems();
    };

    const handleDeleteItem = async (id) => {
        await deleteItem(id);
        loadItems();
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Lista de Itens
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <form noValidate autoComplete="off">
                        <TextField
                            label="Nome"
                            name="nome"
                            value={newItem.nome}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Endereço"
                            name="endereco"
                            value={newItem.endereco}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Cidade"
                            name="cidade"
                            value={newItem.cidade}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Bairro"
                            name="bairro"
                            value={newItem.bairro}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Estado"
                            name="estado"
                            value={newItem.estado}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={
                                editingItem
                                    ? () => handleUpdateItem(editingItem._id)
                                    : handleCreateItem
                            }
                            fullWidth
                            style={{ marginTop: 20 }}
                        >
                            {editingItem ? "Atualizar Item" : "Adicionar Item"}
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={12} md={6}>
                    <List>
                        {items.map((item) => (
                            <ListItem key={item._id} divider>
                                <ListItemText
                                    primary={item.nome}
                                    secondary={`${item.endereco}, ${item.cidade}, ${item.bairro}, ${item.estado}`}
                                />
                                <IconButton
                                    edge="end"
                                    aria-label="editar"
                                    onClick={() => {
                                        setEditingItem(item);
                                        setNewItem({
                                            nome: item.nome,
                                            endereco: item.endereco,
                                            cidade: item.cidade,
                                            bairro: item.bairro,
                                            estado: item.estado,
                                        });
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="excluir"
                                    onClick={() => handleDeleteItem(item._id)}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ItemList;
