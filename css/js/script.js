// Função para mostrar o núcleo clicado
function showNucleo(id) {
  // Esconder todos os núcleos
  const nucleos = document.querySelectorAll('.nucleo-info');
  nucleos.forEach(n => n.style.display = 'none');

  // Mostrar o núcleo selecionado
  const nucleo = document.getElementById(id);
  if (nucleo) {
    nucleo.style.display = 'block';
    nucleo.scrollIntoView({behavior: "smooth"});
  }
}
