// Projects grouped by topic, mirroring the structure of Adrian's public GitHub.
// Each project: [title, repoOrUrl, description, tags]
const topics = [
  {
    name: 'Cybersecurity',
    projects: [
      ['Zero Trust Policy Analysis', 'zero-trust-policy-analysis', 'Examining inconsistent Zero Trust implementation across U.S. public and private sectors, referencing NIST SP 800-207 with Department of Defense and Google BeyondCorp case studies.', ['Policy research', 'Cyber resilience']],
      ['Digital Surveillance Ethics', 'digital-surveillance-ethics', 'Research on law enforcement access to digital information, privacy, surveillance, national security, and civil liberties.', ['Ethics', 'Policy research']],
    ],
  },
  {
    name: 'Networking & Packet Analysis',
    projects: [
      ['TCP Client-Server Chat Application', 'tcp-client-server-chat', 'Concurrent Python chat with separate control and data connections, broadcast and private messaging, and thread-safe session management across multiple simultaneous clients.', ['Python', 'Sockets', 'Threading']],
      ['Wireshark TCP Analysis', 'wireshark-tcp-analysis', 'TCP handshake behavior, sequence and acknowledgment numbers, RTT, flow control, throughput, retransmissions, and congestion control.', ['Wireshark', 'TCP']],
      ['Wireshark HTTP Behavior Analysis', 'wireshark-http-behavior-analysis-lab', 'Analysis of HTTP caching, TCP reassembly, embedded objects, redirects, and Basic Authentication.', ['Wireshark', 'HTTP']],
      ['Wireshark HTTP Packet Analysis', 'wireshark-http-packet-analysis-lab', 'A network traffic analysis lab focused on HTTP, TCP, IP addressing, and packet-level protocol inspection.', ['Wireshark', 'HTTP']],
    ],
  },
  {
    name: 'Quantum Computing',
    projects: [
      ['Grover’s Search Algorithm Simulation', 'grovers-algorithm', 'A Qiskit implementation for a 16-element search space with oracle construction, phase inversion, and amplitude amplification in a 9-qubit architecture — 95.1% target measurement across 1,024 shots.', ['Qiskit', 'Quantum algorithms']],
    ],
  },
  {
    name: 'Software & Systems',
    projects: [
      ['Linux Mini Shell', 'linux-mini-shell', 'A Unix-style shell in C featuring process creation, built-in commands, I/O redirection, pipes, and Linux process analysis.', ['C', 'Linux']],
      ['Fitness Planner', 'fitness-planner-python', 'A Python CLI that generates personalized workout routines and nutrition plans with input validation and dynamic calculations.', ['Python', 'CLI']],
    ],
  },
  {
    name: 'Artificial Intelligence & Cloud',
    projects: [
      ['AWS Agentic AI Weather Agent', 'aws-agentic-ai-weather-agent', 'An agentic AI weather application built with Python, Amazon Bedrock, Claude 4.5 Sonnet, NWS APIs, and Streamlit.', ['Python', 'Amazon Bedrock', 'Streamlit']],
      ['Multi-agent System', 'multi-agent-system', '', ['AI']],
    ],
  },
];

function buildCard([title, repo, description, tags]) {
  const article = document.createElement('article');
  article.className = 'project';

  const heading = document.createElement('h3');
  heading.textContent = title;
  article.append(heading);

  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    article.append(p);
  }

  if (tags && tags.length) {
    const tagWrap = document.createElement('div');
    tagWrap.className = 'tags';
    for (const tag of tags) {
      const span = document.createElement('span');
      span.textContent = tag;
      tagWrap.append(span);
    }
    article.append(tagWrap);
  }

  const link = document.createElement('a');
  link.href = repo.startsWith('http') ? repo : 'https://github.com/AdrianRPG/' + repo;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'text-link';
  link.textContent = 'View repository';
  article.append(link);

  return article;
}

const topicsContainer = document.getElementById('project-topics');
if (topicsContainer) {
  for (const topic of topics) {
    const heading = document.createElement('h3');
    heading.className = 'projects-subheading';
    heading.textContent = topic.name;
    topicsContainer.append(heading);

    const grid = document.createElement('div');
    grid.className = 'topic-grid';
    for (const project of topic.projects) {
      grid.append(buildCard(project));
    }
    topicsContainer.append(grid);
  }
}

// ---- Theme toggle (persisted) ----
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function sync() {
    const isLight = root.getAttribute('data-theme') === 'light';
    toggle.setAttribute('aria-pressed', String(isLight));
    toggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isLight ? '#f6f7f9' : '#101113');
  }
  sync();

  toggle.addEventListener('click', function () {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
      root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }
    sync();
  });
})();

// ---- Scroll reveal animations ----
(function () {
  const sections = document.querySelectorAll('main > section:not(.hero)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    sections.forEach((s) => s.classList.add('reveal', 'is-visible'));
    return;
  }
  sections.forEach((s) => s.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  sections.forEach((s) => io.observe(s));
})();

// ---- Active section indicator (scroll spy) ----
(function () {
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  if (!navLinks.length || !('IntersectionObserver' in window)) return;
  const map = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) map.set(target, link);
  });

  const groupBtns = Array.from(document.querySelectorAll('.nav-group-btn'));
  let current = null;
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const link = map.get(entry.target);
        if (link && link !== current) {
          navLinks.forEach((l) => l.classList.remove('active'));
          groupBtns.forEach((b) => b.classList.remove('active'));
          link.classList.add('active');
          // If the active link lives inside a dropdown group, also mark its group button.
          const group = link.closest('.nav-group');
          if (group) {
            const btn = group.querySelector('.nav-group-btn');
            if (btn) btn.classList.add('active');
          }
          current = link;
        }
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  map.forEach((_, target) => spy.observe(target));
})();

// ---- Portfolio assistant (rule-based, no external calls) ----
(function () {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const log = document.getElementById('chat-log');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const suggestions = document.getElementById('chat-suggestions');
  if (!fab || !panel || !log || !form || !input) return;

  // Knowledge base: each entry has keywords and an HTML answer.
  const kb = [
    {
      keys: ['who', 'about', 'yourself', 'adrian', 'background', 'quién', 'quien', 'sobre'],
      answer: 'Adrian Renato Pérez Galindo is a senior Computer Science student at Florida International University. Originally from Lima, Peru, he is an international student who has studied across three U.S. universities. His focus areas are cybersecurity, software development, quantum computing, cloud computing, and IT.'
    },
    {
      keys: ['education', 'university', 'universities', 'school', 'degree', 'gpa', 'college', 'studied', 'educación', 'estudios'],
      answer: 'Education history: University of Rio Grande (2021–2022, GPA 4.00), Doane University (2022–2023, GPA 3.95, with a specialization in IT & Security and minors in Data Analytics and Business), and currently Florida International University (B.A. in Computer Science, expected August 2027, GPA 3.97).'
    },
    {
      keys: ['skill', 'skills', 'stack', 'technolog', 'tools', 'programming', 'language', 'habilidad', 'lenguaje'],
      answer: 'Skills span four areas: Security (threat analysis, vulnerability assessment, incident response, hardening, risk management); Programming (Python, Java, C, SQL); Tools & technologies (Wireshark, Splunk, Linux, GitHub, VMs, Jupyter, Qiskit, RStudio, AWS S3/CloudFront/IAM, Microsoft Office); and Languages (Spanish native, English fluent, Portuguese basic).'
    },
    {
      keys: ['cyber', 'security', 'hacking', 'seguridad', 'ciber'],
      answer: 'In cybersecurity, Adrian completed the Google Cybersecurity Professional Certificate and the Mastercard Cybersecurity Virtual Experience (Forage), is pursuing the Cisco Junior Cybersecurity Analyst path, and did a Zero Trust policy analysis referencing NIST SP 800-207 with DoD and Google BeyondCorp case studies.'
    },
    {
      keys: ['quantum', 'qiskit', 'grover', 'qubit', 'cuántic', 'cuantic'],
      answer: 'In quantum computing, Adrian built a Grover\u2019s Search simulation in Qiskit (16-element search space, 9-qubit architecture) that reached 95.1% target measurement across 1,024 shots. He also grades a Quantum Computing course (COT 4601) and is joining a Qollab \u00d7 IonQ quantum hackathon.'
    },
    {
      keys: ['project', 'projects', 'work', 'built', 'proyecto', 'portfolio'],
      answer: 'Projects are organized by topic: Cybersecurity (Zero Trust analysis, surveillance ethics), Networking (TCP client-server chat, Wireshark labs), Quantum Computing (Grover\u2019s algorithm), Software & Systems (Linux mini shell, fitness planner), and AI & Cloud (AWS agentic weather agent, multi-agent system). See the Projects section or <a href="https://github.com/AdrianRPG" target="_blank" rel="noopener">GitHub</a>.'
    },
    {
      keys: ['ai', 'artificial', 'agent', 'bedrock', 'machine learning', 'ia', 'inteligencia'],
      answer: 'On the AI side, Adrian built an AWS Agentic AI Weather Agent (Python, Amazon Bedrock, Claude 4.5 Sonnet, NWS APIs, Streamlit) and a multi-agent system. This very assistant is also part of the site, showing applied AI integration.'
    },
    {
      keys: ['hackathon', 'shellhacks', 'gridlock', 'ionq', 'qollab'],
      answer: 'Hackathons: GridLock at ShellHacks 2026 (a team project comparing public utility construction plans using Python, FastAPI, PostgreSQL/PostGIS and the Gemini API, where Adrian worked on backend and API development), and an upcoming Qollab \u00d7 IonQ quantum computing hackathon.'
    },
    {
      keys: ['experience', 'job', 'work experience', 'grader', 'teaching', 'experiencia', 'trabajo'],
      answer: 'Adrian works as a Student Assistant Grader at FIU for Computer Architecture (CDA 3102) and Quantum Computing Online (COT 4601), evaluating coursework with rubrics and coordinating grading workflows with faculty.'
    },
    {
      keys: ['certification', 'certificate', 'cert', 'credential', 'certificación', 'certificado'],
      answer: 'Certifications: Google Cybersecurity Professional Certificate (July 2024), Mastercard Cybersecurity Virtual Experience / Forage (May 2025), plus in-progress credentials in Cybersecurity Intelligence & Information Policy (FIU), AWS Cloud Foundations, and the Cisco Junior Cybersecurity Analyst path.'
    },
    {
      keys: ['hire', 'hiring', 'job', 'role', 'opt', 'available', 'looking', 'opportunit', 'contratar', 'empleo', 'disponible'],
      answer: 'Adrian is seeking OPT-eligible roles: Cybersecurity Analyst, Software Developer, Quantum Computing Researcher, and IT positions.'
    },
    {
      keys: ['contact', 'email', 'reach', 'linkedin', 'github', 'phone', 'contacto', 'correo'],
      answer: 'You can reach Adrian at <a href="mailto:adrianrpg1@gmail.com">adrianrpg1@gmail.com</a>, on <a href="https://www.linkedin.com/in/adrianrpg1" target="_blank" rel="noopener">LinkedIn</a>, or <a href="https://github.com/AdrianRPG" target="_blank" rel="noopener">GitHub</a>.'
    },
    {
      keys: ['peru', 'lima', 'international', 'from', 'nationality', 'perú', 'internacional'],
      answer: 'Adrian is from Lima, Peru, and is an international student in the United States, now based in Miami, Florida.'
    },
    {
      keys: ['language', 'languages', 'spanish', 'english', 'portuguese', 'idioma'],
      answer: 'Languages: Spanish (native), English (fluent), and Portuguese (basic).'
    }
  ];

  const fallback = 'I can tell you about Adrian\u2019s background, education, skills, projects, hackathons, certifications, experience, and how to contact him. Try one of the suggested questions below.';
  const greeting = 'Hi! I\u2019m Adrian\u2019s portfolio assistant. Ask me about his skills, projects, education, or how to get in touch.';

  const chips = ['Who is Adrian?', 'What are his skills?', 'Tell me about his projects', 'Is he available for hire?', 'How do I contact him?'];

  function addMessage(text, who) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + who;
    div.innerHTML = text;
    log.append(div);
    log.scrollTop = log.scrollHeight;
  }

  function answerFor(question) {
    const q = question.toLowerCase();
    let best = null, bestScore = 0;
    for (const entry of kb) {
      let score = 0;
      for (const k of entry.keys) {
        if (q.includes(k)) score += k.length;
      }
      if (score > bestScore) { bestScore = score; best = entry; }
    }
    return best ? best.answer : fallback;
  }

  function respond(question) {
    addMessage(question, 'user');
    setTimeout(() => addMessage(answerFor(question), 'bot'), 220);
  }

  // Build suggestion chips
  chips.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-chip';
    b.textContent = c;
    b.addEventListener('click', () => respond(c));
    suggestions.append(b);
  });

  let opened = false;
  function openPanel() {
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    if (!opened) { addMessage(greeting, 'bot'); opened = true; }
    input.focus();
  }
  function closePanel() {
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  }

  fab.addEventListener('click', () => (panel.hidden ? openPanel() : closePanel()));
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) closePanel(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    respond(q);
    input.value = '';
  });
})();

// ---- Full-section menu (hamburger) ----
(function () {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('full-menu');
  if (!toggle || !menu) return;

  function open() {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }
  function close() {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', () => (menu.hidden ? open() : close()));

  // Close when a section link is chosen.
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

  // Close on Escape or when clicking outside the menu.
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) close(); });
  document.addEventListener('click', (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
})();

// ---- Desktop nav dropdowns (click/keyboard support in addition to hover) ----
(function () {
  const groups = Array.from(document.querySelectorAll('.nav-group'));
  if (!groups.length) return;

  function closeAll(except) {
    groups.forEach((g) => {
      if (g === except) return;
      const btn = g.querySelector('.nav-group-btn');
      g.classList.remove('open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  groups.forEach((group) => {
    const btn = group.querySelector('.nav-group-btn');
    const dropdown = group.querySelector('.nav-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = group.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      closeAll(group);
    });

    // Choosing a sub-link closes the dropdown.
    dropdown.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        group.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      })
    );
  });

  document.addEventListener('click', () => closeAll(null));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(null); });
})();
