export class CampoMinado {
    constructor(linhas, colunas) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.tabuleiro = [];
        this.criarTabuleiro();
    }

    criarTabuleiro() {
        this.tabuleiro = [];
        for (let i = 0; i < this.linhas; i++) {
            this.tabuleiro[i] = [];
            for (let j = 0; j < this.colunas; j++) {
                this.tabuleiro[i][j] = {
                    mina: false,
                    revelado: false,
                    minasVizinhas: 0,
                    bandeira: false
                };
            }
        }
    }

    alternarBandeira(linha, coluna) {
        const quadrado = this.tabuleiro[linha][coluna];
        if (quadrado.revelado) return null;

        quadrado.bandeira = !quadrado.bandeira;
        return quadrado.bandeira;
    }

    implementarMinas(quantidade, linhaInicial, colunaInicial) {
        let minasColocadas = 0;
        while (minasColocadas < quantidade) {
            let linha = Math.floor(Math.random() * this.linhas);
            let coluna = Math.floor(Math.random() * this.colunas);

            // Garante área segura de 3x3 no primeiro clique (clique inicial + vizinhos diretos não ganham bomba)
            if (Math.abs(linha - linhaInicial) <= 1 && Math.abs(coluna - colunaInicial) <= 1) {
                continue;
            }

            if (!this.tabuleiro[linha][coluna].mina) {
                this.tabuleiro[linha][coluna].mina = true;
                minasColocadas++;
            }
        }
        this.calcularVizinhos();
    }

    calcularVizinhos() {
        for (let i = 0; i < this.linhas; i++) {
            for (let j = 0; j < this.colunas; j++) {
                if (this.tabuleiro[i][j].mina) continue;
                let contagem = 0;

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        let nL = i + x;
                        let nC = j + y;
                        if (nL >= 0 && nL < this.linhas && nC >= 0 && nC < this.colunas) {
                            if (this.tabuleiro[nL][nC].mina) contagem++;
                        }
                    }
                }
                this.tabuleiro[i][j].minasVizinhas = contagem;
            }
        }
    }

    revelarPosicao(linha, coluna, atualizarVisualCallback) {
        if (linha < 0 || linha >= this.linhas || coluna < 0 || coluna >= this.colunas) return "continuar";

        const quadrado = this.tabuleiro[linha][coluna];
        if (quadrado.revelado) return "continuar";

        quadrado.revelado = true;
        atualizarVisualCallback(linha, coluna, quadrado);

        if (quadrado.mina) {
            return "perdeu";
        }

        if (quadrado.minasVizinhas === 0) {
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    this.revelarPosicao(linha + x, coluna + y, atualizarVisualCallback);
                }
            }
        }

        return this.regrasDeJogo() ? "ganhou" : "continuar";
    }

    pegarTabuleiro() {
        return this.tabuleiro;
    }

    regrasDeJogo() {
        for (let i = 0; i < this.linhas; i++) {
            for (let j = 0; j < this.colunas; j++) {
                if (!this.tabuleiro[i][j].mina && !this.tabuleiro[i][j].revelado) {
                    return false;
                }
            }
        }
        return true;
    }
}
