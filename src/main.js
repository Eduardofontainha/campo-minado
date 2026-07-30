import "./componentes/Tabela.js";
import "./componentes/Quadrado.js";
import { CampoMinado } from "./logica/Jogo.js";

const jogo = new CampoMinado(10, 10);
const tabela = document.querySelector("layout-campo");

tabela.iniciar(jogo, 20);
