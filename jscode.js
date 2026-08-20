/* ===== BINARY RAIN COM SILHUETA ===== */
(function () {
  const canvas = document.getElementById("matrix-bg");
  const ctx = canvas.getContext("2d");
  const FS = 13;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let W, H, cols, drops;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.floor(W / FS);
    drops = Array(cols)
      .fill(0)
      .map(() => Math.random() * (H / FS));
  }

  function isInSilhouette(px, py) {
    const cx = W / 2;
    const scale = H / 500;

    const lx = (px - cx) / scale;
    const ly = py / scale;

    const headY = 65;
    const headR = 38;
    if (Math.sqrt(lx * lx + (ly - headY) * (ly - headY)) < headR) return true;

    if (ly > 100 && ly < 440) {
      if (ly < 200) {
        const t = (ly - 100) / 100;
        const halfW = 20 + t * 18;
        if (Math.abs(lx) < halfW) return true;
        const armLeft = lx + 65 - t * 30;
        const armRight = lx - 65 + t * 30;
        if (Math.abs(armLeft) < 14) return true;
        if (Math.abs(armRight) < 14) return true;
      }

      if (ly >= 200 && ly < 300) {
        const halfW = 22;
        if (Math.abs(lx) < halfW) return true;
      }

      if (ly >= 300 && ly < 440) {
        const t = (ly - 300) / 140;
        const legGap = 8 + t * 10;
        const legW = 16;
        if (lx > -(legGap + legW) && lx < -legGap) return true;
        if (lx > legGap && lx < legGap + legW) return true;
      }
    }

    return false;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0.04)";
    ctx.fillRect(0, 0, W, H);
    ctx.font = `bold ${FS}px monospace`;

    for (let i = 0; i < cols; i++) {
      const x = i * FS;
      const y = drops[i] * FS;
      const ch = Math.random() > 0.5 ? "1" : "0";

      if (isInSilhouette(x, y)) {
        if (Math.random() > 0.7) {
          ctx.fillStyle = `rgba(255,255,255,${0.85 + Math.random() * 0.15})`;
        } else {
          ctx.fillStyle = `rgba(0,191,255,${0.65 + Math.random() * 0.35})`;
        }
      } else {
        ctx.fillStyle = `rgba(123,104,238,${0.3 + Math.random() * 0.4})`;
      }

      ctx.fillText(ch, x, y);

      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.6;
    }
  }

  window.addEventListener("load", () => {
    resize();
    window.addEventListener("resize", resize);

    // respeita quem pediu menos animação no sistema; desenha só 1 frame estático
    if (prefersReducedMotion) {
      draw();
      return;
    }

    setInterval(draw, 50);
  });
})();

/* ===== LIGHTBOX CARROSSEL ===== */
let albumAtual = [];
let indexAtual = 0;

function abrirAlbum(imagens, index) {
  albumAtual = imagens;
  indexAtual = index;
  mostrarImagem();
  document.getElementById("lightbox").classList.add("ativo");
}

function mostrarImagem() {
  document.getElementById("lightbox-img").src = albumAtual[indexAtual];
  document.getElementById("btn-prev").style.display =
    indexAtual > 0 ? "flex" : "none";
  document.getElementById("btn-next").style.display =
    indexAtual < albumAtual.length - 1 ? "flex" : "none";
  document.getElementById("lightbox-contador").textContent =
    indexAtual + 1 + " / " + albumAtual.length;
}

function proximaImagem() {
  if (indexAtual < albumAtual.length - 1) {
    indexAtual++;
    mostrarImagem();
  }
}

function imagemAnterior() {
  if (indexAtual > 0) {
    indexAtual--;
    mostrarImagem();
  }
}

function fecharImagem() {
  document.getElementById("lightbox").classList.remove("ativo");
}

document.getElementById("lightbox").addEventListener("click", function (e) {
  if (e.target === this) fecharImagem();
});

document.addEventListener("keydown", function (e) {
  if (!document.getElementById("lightbox").classList.contains("ativo")) return;
  if (e.key === "ArrowRight") proximaImagem();
  if (e.key === "ArrowLeft") imagemAnterior();
  if (e.key === "Escape") fecharImagem();
});