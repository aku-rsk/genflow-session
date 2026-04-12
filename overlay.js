(function(){

/* ========================================= */
/* SEMBUNYIKAN OVERLAY DI WEB LOGIN SAJA     */
/* ========================================= */
if (window.location.hostname.includes("user-genflow.web.app")) {
  return;
}

/* ========================================= */
/* LOAD SESSION                              */
/* ========================================= */
async function loadSession(id){
  try {
    const res = await fetch("https://raw.githubusercontent.com/aku-rsk/genflow-session/main/sessions.json");
    const data = await res.json();
    const session = data[id];

    chrome.runtime.sendMessage({
      action:"processPasteData",
      clipboardText:session
    });
  } catch (err) {
    console.error("Gagal memuat sesi:", err);
  }
}

/* ========================================= */
/* INIT OVERLAY (LIVE UPDATE VERSION)        */
/* ========================================= */
initGenflowOverlay();

function initGenflowOverlay(){

  if (document.getElementById("genflow-overlay-host")) return;

  const host = document.createElement("div");
  host.id = "genflow-overlay-host";
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
  <style>
    :host { all: initial; }
    #gf-pill {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      height: 50px;
      background: rgba(15, 44, 59, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      padding: 0 10px 0 18px;
      z-index: 2147483647;
      font-family: 'Inter', system-ui, sans-serif;
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .gf-logo {
      height: 24px;
      margin-right: 15px;
    }

    .btn-group { display: flex; gap: 6px; }

    .gf-btn {
      padding: 7px 14px;
      border: none;
      border-radius: 16px;
      cursor: pointer;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      font-size: 11px;
      transition: all 0.2s ease;
    }

    .gf-btn:hover { background: rgba(255, 255, 255, 0.2); }

    .gf-btn.active {
      background: linear-gradient(90deg, #00eaff, #0077ff);
      box-shadow: 0 4px 12px rgba(0, 234, 255, 0.4);
    }

    .gf-close {
      margin-left: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #ff4757;
      color: #fff;
      border: none;
      font-weight: bold;
    }
  </style>

  <div id="gf-pill">
    <img src="https://raw.githubusercontent.com/aku-rsk/genflow-session/main/logo-g.png" class="gf-logo"/>

    <div class="btn-group">
      <button class="gf-btn" id="gf1">S1</button>
      <button class="gf-btn" id="gf2">S2</button>
      <button class="gf-btn" id="gf3">S3</button>
    </div>

    <button class="gf-close" id="gf_kill" title="Tutup Semua Tab">✕</button>
  </div>
  `;

  // Logika Tombol
  shadow.getElementById("gf1").onclick=()=>{ setActive("gf1"); loadSession("btn1"); };
  shadow.getElementById("gf2").onclick=()=>{ setActive("gf2"); loadSession("btn2"); };
  shadow.getElementById("gf3").onclick=()=>{ setActive("gf3"); loadSession("btn3"); };
  shadow.getElementById("gf_kill").onclick=()=>{
    if(confirm("Tutup semua tab?")) chrome.runtime.sendMessage({ action: "CLOSE_ALL_TABS" });
  };

  function setActive(id){
    shadow.querySelectorAll(".gf-btn").forEach(b => b.classList.remove("active"));
    shadow.getElementById(id).classList.add("active");
    chrome.storage.local.set({genflow_server: id});
  }

  chrome.storage.local.get(["genflow_server"], (res)=>{
    if(res.genflow_server) shadow.getElementById(res.genflow_server)?.classList.add("active");
  });
}
})();
