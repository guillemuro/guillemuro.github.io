(() => {
  'use strict';

  /* ==========================================================================
     Traducción español / inglés
     El HTML está en español (idioma por defecto). Este script sustituye cada texto
     por su equivalente en inglés y recuerda el original para poder volver atrás.
     Para añadir o corregir una traducción basta con editar el diccionario EN.
     ========================================================================== */

  const root = document.documentElement;
  const STORAGE_KEY = 'lang';

  const EN = new Map(Object.entries({
    /* ---- Cabecera, navegación y accesibilidad ---- */
    'Saltar al contenido': 'Skip to content',
    'Guillermo Muro, inicio': 'Guillermo Muro, home',
    'Principal': 'Main',
    'Sobre mí': 'About me',
    'Experiencia': 'Experience',
    'Certificaciones': 'Certifications',
    'Contacto': 'Contact',
    'Activar modo oscuro': 'Switch to dark mode',
    'Activar modo claro': 'Switch to light mode',
    'Abrir menú': 'Open menu',
    'Cerrar menú': 'Close menu',
    'Cerrar diploma': 'Close diploma',

    /* ---- Metadatos ---- */
    'Ingeniero cloud en Zaragoza. Administro y protejo entornos Microsoft 365 para varios clientes: Exchange Online, Teams, SharePoint, OneDrive, Intune, Entra ID y Defender. CKA, SC-401 y Oracle Cloud Infrastucture.':
      'Cloud engineer in Zaragoza. I administer and secure Microsoft 365 environments for several clients: Exchange Online, Teams, SharePoint, OneDrive, Intune, Entra ID and Defender. CKA, SC-401 and Oracle Cloud Infrastructure.',
    'Administro y protejo entornos Microsoft 365 para varios clientes. CKA, SC-401 y Oracle Cloud Infrastucture.':
      'I administer and secure Microsoft 365 environments for several clients. CKA, SC-401 and Oracle Cloud Infrastructure.',

    /* ---- Hero ---- */
    'Ingeniero Cloud en Zaragoza. Administro y protejo entornos Microsoft 365 para varios clientes.':
      'Cloud Engineer in Zaragoza. I administer and secure Microsoft 365 environments for several clients.',
    'Conecta en LinkedIn': 'Connect on LinkedIn',
    'Perfil de Microsoft Learn': 'Microsoft Learn profile',
    'Certificaciones principales': 'Main certifications',
    'Guillermo Muro sonriendo en la montaña, con una cumbre nevada al fondo':
      'Guillermo Muro smiling in the mountains, with a snow-capped peak behind him',
    'Apps de Microsoft 365 con las que trabajo': 'Microsoft 365 apps I work with',
    'Microsoft Teams: ver qué hago': 'Microsoft Teams: see what I do',
    'SharePoint Online: ver qué hago': 'SharePoint Online: see what I do',
    'OneDrive: ver qué hago': 'OneDrive: see what I do',
    'Exchange Online: ver qué hago': 'Exchange Online: see what I do',
    'Microsoft Intune: ver qué hago': 'Microsoft Intune: see what I do',
    'Microsoft Entra ID: ver qué hago': 'Microsoft Entra ID: see what I do',
    'Microsoft Defender: ver qué hago': 'Microsoft Defender: see what I do',

    /* ---- Carrusel de Microsoft 365 ---- */
    'Microsoft 365, app a app': 'Microsoft 365, app by app',
    'Las herramientas con las que trabajo cada día. Arrastra las tarjetas o usa las flechas para ver qué hago en cada una.':
      'The tools I work with every day. Drag the cards or use the arrows to see what I do in each one.',
    'Aplicaciones de Microsoft 365 con las que trabajo': 'Microsoft 365 applications I work with',
    'carrusel': 'carousel',
    'diapositiva': 'slide',
    'App anterior': 'Previous app',
    'App siguiente': 'Next app',
    'Elegir app': 'Choose app',
    'Sincronizado': 'Synced',
    'Migración a Exchange Online': 'Migration to Exchange Online',
    'Portátil': 'Laptop',
    'Móvil': 'Mobile',
    'Usuario': 'User',
    'Acceso': 'Access',
    'Acceso condicional': 'Conditional Access',
    'Resuelto': 'Resolved',

    'Comunicación y reuniones': 'Communication and meetings',
    'Implanto, administro y doy soporte a Teams en entornos de varios clientes, dentro de proyectos de transformación digital y modernización del puesto de trabajo.':
      "I deploy, administer and support Teams in several clients' environments, as part of digital transformation and modern workplace projects.",
    'Implantación en proyectos de modernización del puesto de trabajo': 'Deployment in modern workplace projects',
    'Administración del servicio para varios clientes': 'Service administration for several clients',
    'Soporte e incidencias de nivel avanzado': 'Advanced-level support and incident handling',

    'Sitios y documentos de equipo': 'Team sites and documents',
    'Administro y doy soporte a SharePoint Online, el espacio donde cada cliente comparte sus sitios y documentos de equipo.':
      'I administer and support SharePoint Online, where each client shares its team sites and documents.',
    'Implantación y administración para varios clientes': 'Deployment and administration for several clients',

    'Archivos de cada usuario': "Each user's files",
    'Administro y doy soporte a OneDrive, el almacenamiento personal de cada usuario dentro de Microsoft 365.':
      "I administer and support OneDrive, each user's personal storage within Microsoft 365.",

    'Correo y migraciones': 'Email and migrations',
    'Llevo migraciones de correo a Exchange Online, de la planificación a la coexistencia, y administro el correo de varios clientes.':
      'I run email migrations to Exchange Online, from planning through coexistence, and administer email for several clients.',
    'Planificación de la migración': 'Migration planning',
    'Coexistencia con el entorno anterior': 'Coexistence with the previous environment',
    'Resolución de incidencias': 'Incident resolution',

    'Dispositivos': 'Devices',
    'Despliego y configuro los dispositivos de cada cliente con Intune, y me aseguro de que cumplen sus políticas de seguridad segun el esquema Nacional de Seguiridad.':
      "I deploy and configure each client's devices with Intune and make sure they meet their security policies under Spain's National Security Framework (ENS).",
    'Despliegue de dispositivos': 'Device deployment',
    'Configuración': 'Configuration',
    'Cumplimiento y seguridad': 'Compliance and security',

    'Identidades y accesos': 'Identities and access',
    'Gestiono identidades y accesos con Entra ID, y protejo el inicio de sesión con acceso condicional.':
      'I manage identities and access with Entra ID and protect sign-in with Conditional Access.',
    'Gestión de identidades y accesos': 'Identity and access management',

    'Seguridad de puestos y correo': 'Endpoint and email security',
    'Protejo puestos y correo con Defender for Endpoint y Defender for Office 365.':
      'I protect endpoints and email with Defender for Endpoint and Defender for Office 365.',
    'Políticas de protección y gestión de vulnerabilidades': 'Protection policies and vulnerability management',
    'Respuesta ante incidentes': 'Incident response',
    'Antiphishing, antimalware y bastionado del correo': 'Anti-phishing, anti-malware and email hardening',

    /* ---- Sobre mí ---- */
    'Profesional de sistemas e infraestructura especializado en Microsoft 365. Experiencia en administración de plataformas Linux, despliegue y soporte de aplicaciones sobre Kubernetes, gestión de almacenamiento Pure Storage y operaciones de infraestructura y DevOps.':
      'Systems and infrastructure professional specialized in Microsoft 365. Experience in Linux platform administration, deployment and support of applications on Kubernetes, Pure Storage storage management, and infrastructure and DevOps operations.',
    'Seguridad': 'Security',
    'Identidad': 'Identity',
    'Migraciones': 'Migrations',
    'Infraestructura': 'Infrastructure',
    'Implantación, administración y soporte para múltiples clientes.': 'Deployment, administration and support for multiple clients.',
    'Defender for Endpoint y Office 365, Intune, acceso condicional y cumplimiento.': 'Defender for Endpoint and Office 365, Intune, Conditional Access and compliance.',
    'Gestión de identidades y accesos con Microsoft Entra ID.': 'Identity and access management with Microsoft Entra ID.',
    'Correo a Exchange Online: planificación, coexistencia e incidencias.': 'Email to Exchange Online: planning, coexistence and incident handling.',
    'Linux, Kubernetes, containers y almacenamiento Pure Storage FlashArray.': 'Linux, Kubernetes, containers and Pure Storage FlashArray storage.',
    'perfil.yaml': 'profile.yaml',
    'perfil/v1': 'profile/v1',
    'Sobre_Mi': 'About_Me',
    'Zaragoza, España': 'Zaragoza, Spain',
    'rol': 'role',
    'foco': 'focus',
    'seguridad de la información': 'information security',
    'certificaciones': 'certifications',
    'infraestructura': 'infrastructure',
    'automatizacion': 'automation',

    /* ---- Experiencia ---- */
    '10 meses': '10 months',
    '2 años y 6 meses': '2 years and 6 months',
    'Jornada completa, Zaragoza, híbrido': 'Full-time, Zaragoza, hybrid',
    '. Jornada completa, España, híbrido': '. Full-time, Spain, hybrid',
    '. Jornada completa, Zaragoza, presencial': '. Full-time, Zaragoza, on-site',
    '. Jornada parcial, Zaragoza, presencial': '. Part-time, Zaragoza, on-site',
    'Implantación, administración y soporte N2 de entornos Microsoft 365 para múltiples clientes, dentro de proyectos de transformación digital y modernización del puesto de trabajo.':
      'Deployment, administration and L2 support of Microsoft 365 environments for multiple clients, as part of digital transformation and modern workplace projects.',
    'Microsoft 365 y correo': 'Microsoft 365 and email',
    'Exchange Online, Teams, SharePoint Online y OneDrive. Migraciones de correo a Exchange Online: planificación, coexistencia y resolución de incidencias.':
      'Exchange Online, Teams, SharePoint Online and OneDrive. Email migrations to Exchange Online: planning, coexistence and incident resolution.',
    'Defender for Endpoint: políticas de protección, vulnerabilidades y respuesta ante incidentes.':
      'Defender for Endpoint: protection policies, vulnerabilities and incident response.',
    'Defender for Office 365: antiphishing, antimalware y bastionado.': 'Defender for Office 365: anti-phishing, anti-malware and hardening.',
    'Dispositivos e identidad': 'Devices and identity',
    'Intune: despliegue de dispositivos, configuración, cumplimiento y seguridad. Identidades y accesos con Entra ID y acceso condicional.':
      'Intune: device deployment, configuration, compliance and security. Identities and access with Entra ID and Conditional Access.',
    'Soporte avanzado y cumplimiento': 'Advanced support and compliance',
    'Incidencias de nivel avanzado y análisis de causa raíz en infraestructuras cloud. Controles de seguridad y cumplimiento normativo.':
      'Advanced-level incidents and root cause analysis in cloud infrastructure. Security controls and regulatory compliance.',
    'Administración de servidores': 'Server administration',
    'Almacenamiento de datos': 'Data storage',
    'Gestión de servicios TI': 'IT service management',
    'Infraestructura y CAU': 'Infrastructure and service desk (CAU)',
    'Sistemas operativos': 'Operating systems',
    'CAU': 'Service desk',
    'DevOps Developer, prácticas': 'DevOps Developer, internship',
    'Montaje de un e-commerce: estructura de páginas, contenedores, caché y redes.':
      'Setting up an e-commerce site: page structure, containers, caching and networking.',

    /* ---- Certificaciones ---- */
    'Microsoft, examen SC-401': 'Microsoft, SC-401 exam',
    'Válida jun 2026 – jun 2027': 'Valid Jun 2026 – Jun 2027',
    'Válida may 2023 – may 2026': 'Valid May 2023 – May 2026',
    'Expedida abr 2026': 'Issued Apr 2026',
    'Válida nov 2026 – nov 2028': 'Valid Nov 2026 – Nov 2028',
    'Expedida nov 2026': 'Issued Nov 2026',
    'Verificar en Oracle': 'Verify on Oracle',
    'Verificar en Claude': 'Verify on Claude',
    'Oracle Cloud Infrastucture': 'Oracle Cloud Infrastructure',
    'Cloud Infrastucture Associate': 'Cloud Infrastructure Associate',
    'Ciberseguridad': 'Cybersecurity',
    'Oracle Cloud Infrastucture, válida nov 2026 – nov 2028. ID 333056797OCI26FNDCFA': 'Oracle Cloud Infrastructure, valid Nov 2026 – Nov 2028. ID 333056797OCI26FNDCFA',
    'Claude on Google Cloud, expedida nov 2026. ID 1bfa9166d1c648fdf48897a259a865db': 'Claude on Google Cloud, issued Nov 2026. ID 1bfa9166d1c648fdf48897a259a865db',
    'Verificar en Microsoft Learn': 'Verify on Microsoft Learn',
    'Verificar en Inaem': 'Verify on INAEM',
    'Verificar en Alison': 'Verify on Alison',
    'Verificar en Credly': 'Verify on Credly',
    'Verificar en DataFlair': 'Verify on DataFlair',
    'Ver diploma': 'View diploma',
    'Ciberseguridad, 25 horas': 'Cybersecurity, 25 hours',
    'Instituto Aragonés de Empleo': 'Aragon Employment Institute (INAEM)',
    'Insignia de Microsoft Certified Associate': 'Microsoft Certified Associate badge',
    'Insignia de Certified Kubernetes Administrator': 'Certified Kubernetes Administrator badge',
    'Logotipo del Instituto Aragonés de Empleo': 'Aragon Employment Institute logo',
    'Logotipo de Alison': 'Alison logo',
    'Insignia de Cisco Introduction to Modern AI': 'Cisco Introduction to Modern AI badge',
    'Insignia de Cisco Python Essentials 1': 'Cisco Python Essentials 1 badge',
    'Logotipo de Cisco Networking Academy': 'Cisco Networking Academy logo',
    'Certified Kubernetes Administrator. Válida may 2023 – may 2026.': 'Certified Kubernetes Administrator. Valid May 2023 – May 2026.',
    'Instituto Aragonés de Empleo. Expedida abr 2026. ID 25/0211.TRA.018-01.': 'Aragon Employment Institute (INAEM). Issued Apr 2026. ID 25/0211.TRA.018-01.',
    'Alison. Marzo de 2024.': 'Alison. March 2024.',
    'Alison. Agosto de 2025. ID 3517-38179196.': 'Alison. August 2025. ID 3517-38179196.',
    'Cisco Networking Academy. Noviembre de 2024.': 'Cisco Networking Academy. November 2024.',
    'Cisco Networking Academy. Enero de 2025.': 'Cisco Networking Academy. January 2025.',
    'DataFlair. Febrero de 2025.': 'DataFlair. February 2025.',

    /* ---- Stack ---- */
    'Experiencia técnica agrupada por áreas de especialización.': 'Technical experience grouped by area of specialization.',
    'Microsoft 365 e identidad': 'Microsoft 365 and identity',
    'Seguridad y cumplimiento': 'Security and compliance',
    'Cloud, contenedores y DevOps': 'Cloud, containers and DevOps',
    'Sistemas y almacenamiento': 'Systems and storage',
    'Código y datos': 'Code and data',
    'Operación y servicio': 'Operations and service',
    'Idioma y equipo': 'Language and team',
    'Detección de intrusiones': 'Intrusion detection',
    'Análisis de ciberamenazas': 'Cyber threat analysis',
    'Riesgos digitales': 'Digital risk',
    'Protección de datos': 'Data protection',
    'Cumplimiento normativo': 'Regulatory compliance',
    'Virtualización cloud': 'Cloud virtualization',
    'Desarrollo web': 'Web development',
    'CAU y soporte avanzado': 'Service desk and advanced support',
    'Análisis de causa raíz': 'Root cause analysis',
    'Documentación': 'Documentation',
    'Consultoría': 'Consulting',
    'Inglés': 'English',
    'Trabajo en equipo': 'Teamwork',
    'Comunicación': 'Communication',
    'Organización': 'Organization',
    'Resolución de problemas': 'Problem solving',
    'Dirección de equipos': 'Team leadership',

    /* ---- Formación ---- */
    'Formación': 'Education',
    'Técnico en Desarrollo de Aplicaciones Web.': 'Technician in Web Application Development.',
    '2º Desarrollo de Aplicaciones Web': '2nd year, Web Application Development',
    '1º Desarrollo de Aplicaciones Web': '1st year, Web Application Development',
    'Grado Medio en Redes y Telecomunicaciones': 'Intermediate Vocational Degree in Networks and Telecommunications',

    /* ---- Contacto ---- */
    'Hablemos': "Let's talk",
    'Construyendo soluciones seguras, eficientes y centradas en las personas.': 'Building secure, efficient, people-centered solutions.',
    'Retrato de Guillermo Muro': 'Portrait of Guillermo Muro',
    'Copiar enlace de LinkedIn': 'Copy LinkedIn link',
    'Enlace de LinkedIn copiado': 'LinkedIn link copied',
  }));

  const MONTHS = {
    ene: 'Jan', feb: 'Feb', mar: 'Mar', abr: 'Apr', may: 'May', jun: 'Jun',
    jul: 'Jul', ago: 'Aug', sept: 'Sep', sep: 'Sep', oct: 'Oct', nov: 'Nov', dic: 'Dec',
  };
  const RE_MONTH = /^(ene|feb|mar|abr|may|jun|jul|ago|sept|sep|oct|nov|dic)( \d{4})?$/;
  const RE_SLIDE = /^(.+), (\d+) de (\d+)$/;     // «Microsoft Teams, 1 de 7»

  const norm = (s) => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

  // Devuelve la versión inglesa de un texto (conservando espacios de los extremos) o null si no hay
  const translate = (raw) => {
    const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const key = norm(m[2]);
    if (!key) return null;
    let out = EN.get(key);
    if (out === undefined) {
      let r;
      if ((r = key.match(RE_MONTH))) out = MONTHS[r[1]] + (r[2] || '');
      else if ((r = key.match(RE_SLIDE))) out = `${r[1]}, ${r[2]} of ${r[3]}`;
    }
    if (out === undefined) return null;
    const result = m[1] + out + m[3];
    return result === raw ? null : result;
  };

  /* ---------- Estado: original en español de cada texto o atributo traducido ---------- */
  const textState = new Map();   // nodo de texto -> { es, en }
  const attrState = new Map();   // elemento -> Map(atributo -> { es, en })
  const ATTRS = ['alt', 'aria-label', 'title', 'data-title', 'data-meta', 'aria-roledescription'];
  const ATTR_SELECTOR = ATTRS.map((a) => `[${a}]`).join(',');
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA']);

  const translateText = (node) => {
    if (!node.parentElement || SKIP.has(node.parentElement.tagName)) return;
    const st = textState.get(node);
    if (st && node.nodeValue === st.en) return;           // es nuestra propia escritura
    const out = translate(node.nodeValue);
    if (out === null) { textState.delete(node); return; }
    textState.set(node, { es: node.nodeValue, en: out });
    node.nodeValue = out;
  };

  const translateAttr = (el, attr) => {
    const value = el.getAttribute(attr);
    if (value === null) return;
    let perEl = attrState.get(el);
    const st = perEl && perEl.get(attr);
    if (st && value === st.en) return;
    const out = translate(value);
    if (out === null) { if (st) perEl.delete(attr); return; }
    if (!perEl) attrState.set(el, (perEl = new Map()));
    perEl.set(attr, { es: value, en: out });
    el.setAttribute(attr, out);
  };

  const translateTree = (node) => {
    if (node.nodeType === 3) { translateText(node); return; }
    if (node.nodeType !== 1) return;
    if (node.matches(ATTR_SELECTOR)) ATTRS.forEach((a) => translateAttr(node, a));
    node.querySelectorAll(ATTR_SELECTOR).forEach((el) => ATTRS.forEach((a) => translateAttr(el, a)));
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) translateText(walker.currentNode);
  };

  const metas = () => document.querySelectorAll('meta[name="description"], meta[property="og:description"]');

  const applyEnglish = () => {
    translateTree(document.body);
    metas().forEach((m) => translateAttr(m, 'content'));
  };

  const restoreSpanish = () => {
    textState.forEach((st, node) => { if (node.nodeValue === st.en) node.nodeValue = st.es; });
    attrState.forEach((perEl, el) => perEl.forEach((st, attr) => {
      if (el.getAttribute(attr) === st.en) el.setAttribute(attr, st.es);
    }));
    textState.clear();
    attrState.clear();
  };

  /* ---------- Observador: traduce lo que main.js escribe después (aria-label, avisos, visor…) ---------- */
  const OBSERVE = { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS };
  const observer = new MutationObserver((records) => {
    observer.disconnect();
    for (const r of records) {
      if (r.type === 'characterData') translateText(r.target);
      else if (r.type === 'attributes') translateAttr(r.target, r.attributeName);
      else r.addedNodes.forEach(translateTree);
    }
    observer.observe(document.body, OBSERVE);
  });

  /* ---------- Selector de idioma ---------- */
  const btn = document.querySelector('[data-lang-toggle]');
  let current = 'es';

  const syncButton = () => {
    if (!btn) return;
    // Estas etiquetas no pasan por el diccionario: se fijan aquí según el idioma activo
    btn.setAttribute('aria-label', current === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés');
    btn.setAttribute('lang', current === 'en' ? 'en' : 'es');
  };

  const setLang = (lang, persist) => {
    current = lang === 'en' ? 'en' : 'es';
    root.lang = current;
    root.dataset.lang = current;
    observer.disconnect();
    if (current === 'en') {
      applyEnglish();
      observer.observe(document.body, OBSERVE);
    } else {
      restoreSpanish();
    }
    syncButton();
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, current); } catch (e) { /* almacenamiento no disponible */ }
    }
    document.dispatchEvent(new CustomEvent('langchange', { detail: current }));
  };

  if (btn) btn.addEventListener('click', () => setLang(current === 'en' ? 'es' : 'en', true));

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* sin acceso */ }
  root.dataset.lang = 'es';
  syncButton();
  if (saved === 'en') setLang('en', false);
})();
