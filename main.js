// =================== CONFIGURACIÓN ===================
const CONFIG = {
  brandName: "presentacion",
  pageUrl: location.href,
  owner: {
    name: "Elena Smmith",
    role: " Dra.Ginecología y Obstetricia",
    city: "Roma Sur",
    avatar: "logo.png"
  },
  contact: {
    phone: "+52 3343340062",
    mobile: "+52 3343340062",
    email: "dinahgomez19@gmail.com",
    whatsappMsg: "Hola deseo agendar consulta",
    address: "Roma Sur."
  },
  links: [
    { 
      label: "WhatsApp", 
      sub: "Cotiza ahora", 
      url: () => ``, 
      icon: "whatsapp", 
      primary: true,
      class: "whatsapp"
    },
    { label: "Sitio Web", sub:"creaciones.19", url: "", icon: "globe" },
    { label: "Portafolio", sub:"informacion", url: "", icon: "folder" },
    { label: "Tienda", sub:"Productos", url: "", icon: "cart" }
  ],
  social: [
    { label:"Facebook", url:"", icon:"facebook" },
    { label:"Instagram", url:"", icon:"instagram" },
    { label:"TikTok", url:"", icon:"tiktok" },
    { label:"YouTube", url:"", icon:"youtube" },
    { label:"LinkedIn", url:"", icon:"linkedin" }
  ]
};

// =================== UTILIDADES ===================
const $ = (sel, root=document) => root.querySelector(sel);
const el = (tag, attrs={}, {children=[]}={}) => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class') n.className=v;
    else if(k==='html') n.innerHTML=v;
    else n.setAttribute(k,v);
  });
  (children||[]).forEach(c=> n.appendChild(c));
  return n;
};

// =================== ICONOS ===================
const ICONS = {
  whatsapp:`<i class="fab fa-whatsapp"></i>`,
  globe:`<i class="fas fa-globe"></i>`,
  folder:`<i class="fas fa-folder"></i>`,
  cart:`<i class="fas fa-shopping-cart"></i>`,
  mail:`<i class="fas fa-envelope"></i>`,
  phone:`<i class="fas fa-phone"></i>`,
  map:`<i class="fas fa-map-marker-alt"></i>`,
  facebook:`<i class="fab fa-facebook"></i>`,
  instagram:`<i class="fab fa-instagram"></i>`,
  tiktok:`<i class="fab fa-tiktok"></i>`,
  youtube:`<i class="fab fa-youtube"></i>`,
  linkedin:`<i class="fab fa-linkedin"></i>`
};

// =================== RENDER DINÁMICO ===================
$('#ownerName').textContent = CONFIG.owner.name;
$('#ownerRole').textContent = CONFIG.owner.role;
$('#ownerCity').textContent = CONFIG.owner.city;
$('#avatarImg').src = CONFIG.owner.avatar;
$('#brandName').textContent = CONFIG.brandName;
$('#year').textContent = new Date().getFullYear();

// Construye botones genéricos
const buildBtn = ({label, sub, url, icon, primary, class: extraClass}) => {
  const href = (typeof url === 'function') ? url() : url;
  const btn = el('a', {class:`btn ${primary? 'primary':''} ${extraClass||''}`, href, target:"_blank", rel:"noopener"});
  const ico = el('span',{class:'ico', html:ICONS[icon]||''});
  const text = el('span',{html:`<span class="kicker">${sub||''}</span><span class="label">${label}</span>`});
  btn.append(ico, text);
  return btn;
};

// Render links
const linksGrid = $('#linksGrid');
CONFIG.links.forEach(l=> linksGrid.appendChild(buildBtn(l)));

// Render redes
const socialGrid = $('#socialGrid');
CONFIG.social.forEach(s=> socialGrid.appendChild(buildBtn(s)));

// =================== VCARD ===================
function buildVCard() {
  const name = (CONFIG?.owner?.name || "Contacto").trim();
  const { mobile="", phone="", email="", address="" } = (CONFIG?.contact || {});
  const url = CONFIG?.pageUrl || location.href;

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${name};;;`,
    `FN:${name}`,
    mobile ? `TEL;TYPE=CELL:${mobile.replace(/\s|\(|\)|-/g,"")}` : "",
    phone  ? `TEL;TYPE=VOICE:${phone.replace(/\s|\(|\)|-/g,"")}` : "",
    email  ? `EMAIL;TYPE=INTERNET:${email}` : "",
    address? `ADR;TYPE=HOME:;;${address.replace(/,/g,";")};;;;` : "",
    `URL:${url}`,
    "END:VCARD"
  ].filter(Boolean).join("\r\n");
}

(function setupSaveBtn(){
  const btn = document.getElementById("saveBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const vcf = buildVCard();
    const filename = ((CONFIG?.owner?.name)||"contacto").replace(/\s+/g,"_") + ".vcf";
    try {
      const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 1500);
    } catch (e) {
      const dataUrl = "data:text/vcard;charset=utf-8," + encodeURIComponent(vcf);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  });
})();

// =================== COMPARTIR ===================
document.getElementById('shareBtn').addEventListener('click', () => {
  if (navigator.share) {
    navigator.share({
      title: "Mi Tarjeta Digital",
      text: "Te comparto mi tarjeta digital",
      url: window.location.href
    }).catch(console.error);
  } else {
    alert("La función de compartir no está soportada en este navegador.");
  }
});
