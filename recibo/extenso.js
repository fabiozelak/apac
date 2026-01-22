function valorPorExtenso(valor) {
  if (isNaN(valor)) return "";

  const unidades = [
    "", "um", "dois", "três", "quatro",
    "cinco", "seis", "sete", "oito", "nove"
  ];

  const especiais = [
    "dez", "onze", "doze", "treze", "quatorze",
    "quinze", "dezesseis", "dezessete",
    "dezoito", "dezenove"
  ];

  const dezenas = [
    "", "", "vinte", "trinta", "quarenta",
    "cinquenta", "sessenta", "setenta",
    "oitenta", "noventa"
  ];

  const centenas = [
    "", "cento", "duzentos", "trezentos",
    "quatrocentos", "quinhentos",
    "seiscentos", "setecentos",
    "oitocentos", "novecentos"
  ];

  function escreveDezena(n) {
    if (n < 10) return unidades[n];
    if (n < 20) return especiais[n - 10];
    const d = Math.floor(n / 10);
    const u = n % 10;
    return dezenas[d] + (u ? " e " + unidades[u] : "");
  }

  function escreveCentena(n) {
    if (n === 100) return "cem";
    const c = Math.floor(n / 100);
    const resto = n % 100;
    return centenas[c] + (resto ? " e " + escreveDezena(resto) : "");
  }

  function escreveMilhar(n) {
    if (n < 100) return escreveDezena(n);
    if (n < 1000) return escreveCentena(n);

    const mil = Math.floor(n / 1000);
    const resto = n % 1000;

    let texto = mil === 1 ? "mil" : escreveCentena(mil) + " mil";
    return texto + (resto ? " e " + escreveCentena(resto) : "");
  }

  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);

  let texto = "";

  if (inteiro === 0) {
    texto = "zero real";
  } else if (inteiro === 1) {
    texto = "um real";
  } else {
    texto = escreveMilhar(inteiro) + " reais";
  }

  if (centavos > 0) {
    texto += centavos === 1
      ? " e um centavo"
      : " e " + escreveDezena(centavos) + " centavos";
  }

  return texto;
}
