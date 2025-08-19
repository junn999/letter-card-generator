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
//--------------------------------------------------------
const lyric = document.getElementById("text-lyric");
const counter = document.getElementById("char-count");
const MAX_CHARS = 600;

// Actualiza contador y limita caracteres
lyric.addEventListener("input", function () {
  let text = lyric.innerText;

  if (text.length > MAX_CHARS) {
    lyric.innerText = text.substring(0, MAX_CHARS);
    placeCaretAtEnd(lyric);
  }

  counter.textContent = lyric.innerText.length + " / " + MAX_CHARS;
});

// Bloquear teclas si se pasa del límite
lyric.addEventListener("keydown", function (e) {
  let text = lyric.innerText;
  if (text.length >= MAX_CHARS &&
      e.key.length === 1 && // evita bloquear Enter, Backspace, etc
      !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
  }
});

function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window.getSelection != "undefined"
      && typeof document.createRange != "undefined") {
    let range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

// ------------------ Exportar como imagen ------------------
document.getElementById("download").addEventListener("click", function () {
  const target = document.querySelector(".rect-default"); // asegúrate que esta clase esté aplicada correctamente
  counter.style.display = "none";
  html2canvas(target, {
    scale: 3,
    backgroundColor: null,
    useCORS: true
  }).then(canvas => {
    canvas.toBlob(function (blob) {
      const h1content = document.getElementById("text-name").innerHTML;
      const filename = h1content.replace(/(<([^>]+)>)/ig, "") + ".png";
      window.saveAs(blob, filename);
       counter.style.display = "block";
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
  const placeholder = el.dataset.placeholder;

  // Cuando enfoca
  el.addEventListener("focus", function () {
    if (el.innerText.trim() === placeholder) {
      el.innerText = "";
    }
  });

  // Cuando pierde el foco
  el.addEventListener("blur", function () {
    if (el.innerText.trim() === "") {
      el.innerText = placeholder;
    }
  });
});




