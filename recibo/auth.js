const SENHA_CORRETA = "apac2026";

function login() {
  const senha = document.getElementById("senha").value;
  if (senha === SENHA_CORRETA) {
    localStorage.setItem("auth", "ok");
    window.location.href = "sistema.html";
  } else {
    document.getElementById("erro").innerText = "Senha incorreta";
  }
}
