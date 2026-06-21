function abrirRecibo() {
  const dados = {
    referencia: document.getElementById("referencia").value,
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    valor: document.getElementById("valor").value,
    data: new Date().toLocaleDateString("pt-BR")
  };

  localStorage.setItem("dadosRecibo", JSON.stringify(dados));
  window.open("recibo.html", "_blank");
}
