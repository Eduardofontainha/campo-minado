import "./components/Tabela.js";
import "./components/Quadrado.js";
import { CampoMinado } from "./logic/Jogo.js";

const tabela = document.querySelector("layout-campo");
const reiniciarBtn = document.getElementById("btn-reiniciar");
const selecionarDificuldade = document.getElementById("selecionar-dificuldade");

let quantidadeMinasAtual = 10; 
const jogo = new CampoMinado(10, quantidadeMinasAtual);

const executarReiniciarJogo = () => {
    tabela.reiniciarJogo();
    tabela.iniciar(jogo, quantidadeMinasAtual);
};

if (selecionarDificuldade) {
    selecionarDificuldade.addEventListener("change", (event) => {
        const dificuldade = event.target.value;
        switch (dificuldade) {
            case "facil":
                quantidadeMinasAtual = 10;
                break;
            case "medio":
                quantidadeMinasAtual = 20;
                break;
            case "dificil":
                quantidadeMinasAtual = 30;
                break;
            default:
                quantidadeMinasAtual = 20;
        }   
        executarReiniciarJogo();
    });
}

if (reiniciarBtn) {
    reiniciarBtn.addEventListener("click", () => {
        executarReiniciarJogo();
    });
}

const btnModalJogar = document.getElementById("btn-modal-jogar");
if (btnModalJogar) {
    btnModalJogar.addEventListener("click", () => {
        const modal = document.getElementById("modal-fim-jogo");
        if (modal) modal.classList.remove("ativo"); 
        executarReiniciarJogo(); 
    });
}

tabela.iniciar(jogo, quantidadeMinasAtual);

//Controle Mobile
const btnModoToque = document.getElementById("btn-modo-toque");
window.modoMobileBandeira = false;

if (btnModoToque) {
    btnModoToque.addEventListener("click", () => {
        window.modoMobileBandeira = !window.modoMobileBandeira;

        if (window.modoMobileBandeira) {
            btnModoToque.classList.remove("modo-cavar");
            btnModoToque.classList.add("modo-bandeira");
            btnModoToque.innerHTML = '<span class="icone-modo">🚩</span> Modo: Bandeira';
        } else {
            btnModoToque.classList.remove("modo-bandeira");
            btnModoToque.classList.add("modo-cavar");
            btnModoToque.innerHTML = '<span class="icone-modo">⛏️</span> Modo: Revelar';
        }
    });
}
