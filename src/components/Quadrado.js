export default class Quadrado extends HTMLElement {
  #estado = {
    linha: null,
    coluna: null,
    mina: false,
    revelado: false,
    minasVizinhas: 0,
    bandeira: false,
  };

  #coresNumeros = {
    1: "#0000FF", 2: "#008000", 3: "#FF0000", 4: "#000080",
    5: "#800000", 6: "#008080", 7: "#000000", 8: "#808080",
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["linha", "coluna", "mina", "revelado", "minasvizinhas", "bandeira"];
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "mina") this.#estado.mina = newValue === "true";
    if (name === "linha") this.#estado.linha = Number(newValue);
    if (name === "coluna") this.#estado.coluna = Number(newValue);
    if (name === "revelado") this.#estado.revelado = newValue === "true";
    if (name === "minasvizinhas") this.#estado.minasVizinhas = Number(newValue);
    if (name === "bandeira") this.#estado.bandeira = newValue === "true";

    this.#atualizarVisual();
  }

  #render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = `
    <style>
      div {
        width: 50px;
        height: 50px;
        background: #c0c0c0;
        border: 4px solid;
        border-color: #fff #808080 #808080 #fff;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-family: 'Courier New', monospace;
        font-weight: 900;
        font-size: 24px;
        user-select: none;
        transform: translateZ(6px);
        box-shadow: -2px 2px 5px rgba(0,0,0,0.4);
        transition: all 0.1s ease;
      }
      
      div.revelado {
        background: #e0e0e0;
        border: 1px solid #999;
        transform: translateZ(0px); 
        box-shadow: none;
      }
      
      div.mina {
        background: #ff0000 !important;
      }
    </style>
    <div></div>
`;

    const div = shadow.querySelector("div");

    div.addEventListener("click", () => {
      if (this.#estado.revelado || this.#estado.bandeira) return;

      this.dispatchEvent(
        new CustomEvent("clicou", {
          detail: { linha: this.#estado.linha, coluna: this.#estado.coluna },
          bubbles: true, composed: true
        })
      );
    });


    div.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (this.#estado.revelado) return;

      this.dispatchEvent(
        new CustomEvent("marcou", {
          detail: { linha: this.#estado.linha, coluna: this.#estado.coluna },
          bubbles: true, composed: true
        })
      );
    });

    this.#atualizarVisual();
  }

  #atualizarVisual() {
    const div = this.shadowRoot?.querySelector("div");
    if (!div) return;

    if (this.#estado.revelado) {
      div.classList.add("revelado");
      if (this.#estado.mina) {
        div.classList.add("mina");
        div.textContent = "💣";
      } else if (this.#estado.minasVizinhas > 0) {
        div.textContent = this.#estado.minasVizinhas;
        div.style.color = this.#coresNumeros[this.#estado.minasVizinhas] || "black";
      } else {
        div.textContent = "";
      }
    } else {
      div.classList.remove("revelado", "mina");
      div.style.color = "";

      if (this.#estado.bandeira) {
        div.textContent = "🚩";
      } else {
        div.textContent = "";
      }
    }
  }
}

customElements.define("campo-quadrado", Quadrado);
