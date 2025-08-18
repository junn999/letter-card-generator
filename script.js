// ------------------ Color del fondo y texto ------------------
document.getElementById("color-card").addEventListener("input", function () {
  document.getElementById("rect").style.backgroundColor = this.value;
});

document.getElementById("color-text").addEventListener("input", function () {
  const color = this.value;
  ["text-name", "text-lyric", "text-author"].forEach(id => {
    document.getElementById(id).style.color = color;
  });
});

// ------------------ Gradiente dinámico ------------------
document.getElementById("gradient-toggle").addEventListener("change", function () {
  const gradientOptions = document.getElementById("gradient-options");
  if (this.checked) {
    gradientOptions.style.display = "block";
    gradientOptions.offsetHeight; // fuerza repintado
    applyGradient();
  } else {
    gradientOptions.style.display = "none";
    document.getElementById("rect").style.background = document.getElementById("color-card").value;
  }
});

function applyGradient() {
  const color1 = document.getElementById("gradient-color1").value;
  const color2 = document.getElementById("gradient-color2").value;
  const angle = document.getElementById("gradient-angle").value || 45;
  document.getElementById("rect").style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

["gradient-color1", "gradient-color2", "gradient-angle"].forEach(id => {
  document.getElementById(id).addEventListener("input", applyGradient);
});

// ------------------ Manejo seguro del portapapeles ------------------
function handlePaste(id) {
  document.getElementById(id).addEventListener("paste", function (e) {
    e.preventDefault();
    const plain = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, plain);
  });
}

["text-name", "text-lyric", "text-author"].forEach(handlePaste);

// ------------------ Vista previa de imagen cargada ------------------
function loadFile(event) {
  const image = document.getElementById("output");
  image.src = URL.createObjectURL(event.target.files[0]);
  image.hidden = false;
}
window.loadFile = loadFile; // si usas onchange="loadFile(event)" en HTML

// ------------------ Exportar como imagen ------------------
document.getElementById("download").addEventListener("click", function () {
  const target = document.querySelector(".rect-default"); // asegúrate que esta clase esté aplicada correctamente

  html2canvas(target, {
    scale: 3,
    backgroundColor: null,
    useCORS: true
  }).then(canvas => {
    canvas.toBlob(function (blob) {
      const h1content = document.getElementById("text-name").innerHTML;
      const filename = h1content.replace(/(<([^>]+)>)/ig, "") + ".png";
      window.saveAs(blob, filename);
    });
  });
});

// ------------------ Borde redondeado ------------------
document.getElementById("border").addEventListener("input", function () {
  const value = this.value + "px";
  document.getElementById("rect").style.borderRadius = value;
});

// Limpia el texto al hacer clic si es igual al placeholder
["text-name", "text-author", "text-lyric"].forEach(id => {
  const el = document.getElementById(id);

  // Al hacer click, si el texto coincide con el placeholder => limpiar
  el.addEventListener("focus", function () {
    if (el.innerText.trim() === el.dataset.placeholder) {
      el.innerText = "";
    }
  });

  // Si se queda vacío, restaurar placeholder
  el.addEventListener("blur", function () {
    if (el.innerText.trim() === "") {
      el.innerText = el.dataset.placeholder;
    }
  });
});


