import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import menuLinks from "../jsondata/menulinks.json";
import logo from "../Assets/logo_grande.png";
import "./Header.css";


function Header() {
    return (
      <div>
        <nav id="nav-header">
          <img id="img-header" src={logo} alt="Logo do estude facil"/>         
          <List id="botao-header">
            {menuLinks.map((link) => (
              <ListItem id="li-botao" key={link.path} disablePadding>
                <ListItemButton component={Link} to={link.path}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </nav>
      </div>
    );
  }

export default Header;