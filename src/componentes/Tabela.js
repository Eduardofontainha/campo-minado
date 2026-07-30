export default class Tabela extends HTMLElement {
    constructor() {
        super();
        this.jogo = null;
        this.primeiroClique = true;
        this.quantidadeMinas = 20;
        this.minasRestantes = 20;
        
        // Propriedades do Cronômetro
        this.tempoCorrente = 0;
        this.intervaloTempo = null;

        const shadow = this.attachShadow({ mode: "open" });
        const estilo = document.createElement("style");
        estilo.textContent = `
        :host {
            display: grid;
            grid-template-columns: repeat(10, 50px);
            gap: 2px;
            background: #808080;
            padding: 10px;
            border: 4px solid;
            border-color: #808080 #fff #fff #808080;
        }
        `;
        shadow.appendChild(estilo);
    }

    iniciar(jogo, quantidadeMinas = 20) {
        this.jogo = jogo;
        this.quantidadeMinas = quantidadeMinas;
        this.minasRestantes = quantidadeMinas;
        this.primeiroClique = true;
        
        this.pararCronometro();
        this.tempoCorrente = 0;
        this.atualizarHUD();
        this.render();
    }

    reiniciarJogo() {
        this.jogo.criarTabuleiro();
        this.iniciar(this.jogo, this.quantidadeMinas);
    }

    iniciarCronometro() {
        this.intervaloTempo = setInterval(() => {
            this.tempoCorrente++;
            if (this.tempoCorrente > 999) this.tempoCorrente = 999;
            
            const elementoTempo = document.getElementById("cronometro");
            if (elementoTempo) {
                elementoTempo.textContent = String(this.tempoCorrente).padStart(3, '0');
            }
        }, 1000);
    }

    pararCronometro() {
        if (this.intervaloTempo) {
            clearInterval(this.intervaloTempo);
            this.intervaloTempo = null;
        }
    }

    atualizarHUD() {
        const elementoMinas = document.getElementById("contador-minas");
        const elementoTempo = document.getElementById("cronometro");
        
        if (elementoMinas) elementoMinas.textContent = String(this.minasRestantes).padStart(3, '0');
        if (elementoTempo) elementoTempo.textContent = String(this.tempoCorrente).padStart(3, '0');
    }

    render() {
        const shadow = this.shadowRoot;
        const estilo = shadow.querySelector("style");
        shadow.innerHTML = "";
        shadow.appendChild(estilo);

        const tabuleiro = this.jogo.pegarTabuleiro();

        tabuleiro.forEach((linha, i) => {
            linha.forEach((casa, j) => {
                const quadrado = document.createElement("campo-quadrado");
                quadrado.setAttribute("linha", i);
                quadrado.setAttribute("coluna", j);
                quadrado.id = `q-${i}-${j}`;
                shadow.appendChild(quadrado);
            });
        });
    }

    connectedCallback() {
        this.addEventListener("clicou", this.handleClique);
        this.addEventListener("marcou", this.handleMarcacao);
        this.addEventListener("contextmenu", (e) => e.preventDefault());
    }

    handleClique = (e) => {
        const { linha, coluna } = e.detail;

        if (this.primeiroClique) {
            this.primeiroClique = false;
            this.jogo.implementarMinas(this.quantidadeMinas, linha, coluna);
            this.iniciarCronometro(); 
        }

        const resultado = this.jogo.revelarPosicao(linha, coluna, (l, c, dados) => {
            const elementoVisual = this.shadowRoot.getElementById(`q-${l}-${c}`);
            if (elementoVisual) {
                if (dados.mina) elementoVisual.setAttribute("mina", "true");
                elementoVisual.setAttribute("minasvizinhas", dados.minasVizinhas);
                elementoVisual.setAttribute("revelado", "true");
            }
        });

        if (resultado === "perdeu") {
            this.pararCronometro();
            setTimeout(() => {
                alert("💥 Fim de jogo! Você pisou em uma mina.");
                this.reiniciarJogo();
            }, 60);
        } else if (resultado === "ganhou") {
            this.pararCronometro();
            setTimeout(() => {
                alert(`🏆 Vitória! Você limpou o campo em ${this.tempoCorrente} segundos.`);
                this.reiniciarJogo();
            }, 60);
        }
    }

    handleMarcacao = (e) => {
        const { linha, coluna } = e.detail;
        if (this.primeiroClique) return;

        const temBandeira = this.jogo.alternarBandeira(linha, coluna);
        
        if (temBandeira !== null) {
            const elementoVisual = this.shadowRoot.getElementById(`q-${linha}-${coluna}`);
            if (elementoVisual) {
                elementoVisual.setAttribute("bandeira", temBandeira ? "true" : "false");
                
                this.minasRestantes += temBandeira ? -1 : 1;
                this.atualizarHUD();
            }
        }
    }
}

customElements.define("layout-campo", Tabela);
