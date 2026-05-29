"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  CalendarClock,
  CheckCircle2,
  Coffee,
  Database,
  Download,
  FileKey2,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageCircle,
  QrCode,
  ShieldCheck,
  Smartphone,
  TimerReset,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type Envelope = {
  v: 1;
  alg: "AES-GCM";
  kdf: "PBKDF2-SHA-256";
  iterations: number;
  saltB64: string;
  ivB64: string;
  aadB64: string;
  cipherB64: string;
};

const pixKey = "c23396a1-9c0e-4795-919e-d48e528074f2";
const bitcoinAddress = "bc1qzewr447fjwln66es26qdzkwmpqy3ukfvs89nnz";

const te = new TextEncoder();

function toB64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes));
}

function asBufferSource(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

async function deriveAesKey(passphrase: string, salt: Uint8Array, iterations = 310000) {
  const baseKey = await crypto.subtle.importKey("raw", te.encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: asBufferSource(salt),
      iterations,
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptText(plaintext: string, passphrase: string): Promise<Envelope> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aad = te.encode(
    JSON.stringify({
      app: "ifidie",
      scope: "client-side-demo",
      createdAt: new Date().toISOString(),
    }),
  );
  const key = await deriveAesKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: asBufferSource(iv), additionalData: asBufferSource(aad) },
    key,
    asBufferSource(te.encode(plaintext)),
  );

  return {
    v: 1,
    alg: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: 310000,
    saltB64: toB64(salt),
    ivB64: toB64(iv),
    aadB64: toB64(aad),
    cipherB64: toB64(new Uint8Array(ciphertext)),
  };
}

const pillars = [
  {
    icon: ShieldCheck,
    title: "Zero-knowledge de verdade",
    text: "O app trabalha para que notas e anexos sejam cifrados antes do upload. O servidor orquestra prazos, mas nao precisa ler o cofre.",
  },
  {
    icon: TimerReset,
    title: "Escada de confirmacao",
    text: "Check-in, tolerancia, avisos progressivos e hold final antes de qualquer liberacao para reduzir falso positivo.",
  },
  {
    icon: UsersRound,
    title: "Destinatarios com regras",
    text: "Cada pessoa recebe papel, canal verificado e politica de acesso ao pacote cifrado conforme o plano do titular.",
  },
];

const channels = [
  ["Push web/PWA", "Lembretes rapidos e check-in em um toque.", "Principal MVP"],
  ["E-mail", "Redundancia universal, trilha documental e links expirados.", "Obrigatorio"],
  ["Telegram", "Nudges e botoes rapidos, sem payload sensivel.", "Lembrete"],
  ["WhatsApp", "Alto alcance com opt-in e templates aprovados.", "Premium"],
  ["Passkeys/TOTP", "Step-up auth e revalidacao forte.", "Seguranca"],
];

const roadmap = [
  ["Fundacao", "Auth, passkeys, TOTP, envelopes cifrados e stack local.", "2-3 sem."],
  ["MVP privado", "Check-ins, grace period, push/e-mail, destinatarios e hold final.", "3-5 sem."],
  ["Beta fechado", "Anexos grandes, Telegram bot, restore drill e docs legais basicas.", "2-4 sem."],
  ["Beta pago", "WhatsApp premium, billing, sponsor page e auditoria interna.", "3-4 sem."],
];

export default function Home() {
  const [secret, setSecret] = useState(
    "Instrucoes privadas: entregar pacote cifrado somente apos hold final.",
  );
  const [passphrase, setPassphrase] = useState("uma-passphrase-local-forte");
  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState("");

  const envelopePreview = useMemo(() => {
    if (!envelope) return "Clique em cifrar para gerar um envelope AES-GCM local.";
    return JSON.stringify(envelope, null, 2);
  }, [envelope]);

  async function handleEncrypt() {
    setError("");
    if (passphrase.length < 12) {
      setError("Use uma passphrase com pelo menos 12 caracteres.");
      return;
    }
    setIsEncrypting(true);
    try {
      setEnvelope(await encryptText(secret, passphrase));
    } catch {
      setError("Nao foi possivel cifrar neste navegador.");
    } finally {
      setIsEncrypting(false);
    }
  }

  function downloadEnvelope() {
    if (!envelope) return;
    const blob = new Blob([JSON.stringify(envelope, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ifidie-envelope-demo.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top" aria-label="If I Die">
            <span className="brand-mark">
              <LockKeyhole size={19} />
            </span>
            <span>If I Die</span>
          </a>
          <nav className="nav" aria-label="Principal">
            <a href="#produto">Produto</a>
            <a href="#cripto">Cripto</a>
            <a href="#canais">Canais</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#cafe">Cafe</a>
          </nav>
          <a className="button primary" href="#cripto">
            <FileKey2 size={18} />
            Testar cofre
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">
              <ShieldCheck size={18} />
              SaaS open source de continuidade digital
            </p>
            <h1>If I Die</h1>
            <p className="hero-copy">
              Um orquestrador para check-ins, cofres criptografados client-side,
              destinatarios verificados e liberacao gradual de instrucoes privadas. O
              foco nao e prometer testamento digital: e reduzir risco operacional e
              preservar continuidade.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#produto">
                <CalendarClock size={18} />
                Ver arquitetura
              </a>
              <a className="button" href="#cafe">
                <Coffee size={18} />
                Compre um cafe
              </a>
            </div>
            <div className="hero-metrics" aria-label="Resumo do MVP">
              <div className="metric">
                <strong>0</strong>
                <span>segredos em claro no servidor</span>
              </div>
              <div className="metric">
                <strong>4</strong>
                <span>etapas antes da liberacao</span>
              </div>
              <div className="metric">
                <strong>AGPL</strong>
                <span>base pensada para open source</span>
              </div>
            </div>
          </div>

          <aside className="console" aria-label="Resumo operacional">
            <div className="console-head">
              <strong>Plano ativo</strong>
              <span className="status-pill">
                <CheckCircle2 size={15} />
                protegido
              </span>
            </div>
            <div className="console-body">
              <div className="vault-row">
                <span className="icon-box">
                  <Fingerprint size={20} />
                </span>
                <div>
                  <h3>Passkey + TOTP</h3>
                  <p>Step-up auth antes de editar regras sensiveis.</p>
                </div>
                <span className="tag">MFA</span>
              </div>
              <div className="vault-row">
                <span className="icon-box">
                  <UploadCloud size={20} />
                </span>
                <div>
                  <h3>Manifesto cifrado</h3>
                  <p>Envelope AES-GCM com AAD e versionamento.</p>
                </div>
                <span className="tag">client-side</span>
              </div>
              <div className="vault-row">
                <span className="icon-box">
                  <BellRing size={20} />
                </span>
                <div>
                  <h3>Escalonamento</h3>
                  <p>Push, e-mail, Telegram e hold final.</p>
                </div>
                <span className="tag">anti falso positivo</span>
              </div>
              <div className="vault-row">
                <span className="icon-box">
                  <Database size={20} />
                </span>
                <div>
                  <h3>Storage burro</h3>
                  <p>Postgres para metadados; MinIO para blobs cifrados.</p>
                </div>
                <span className="tag">self-host</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="produto">
        <div className="section-head">
          <div>
            <h2>Produto com limites claros</h2>
            <p className="section-lead">
              O MVP trata continuidade digital como fluxo de operacao privada:
              planejar, checar vida, escalar, bloquear falso positivo e entregar
              pacote cifrado ao destinatario certo.
            </p>
          </div>
        </div>
        <div className="grid">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article className="card" key={pillar.title}>
                <span className="icon-box">
                  <Icon size={21} />
                </span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section" id="cripto">
        <div className="section-head">
          <div>
            <h2>Cofre client-side</h2>
            <p className="section-lead">
              Esta demonstracao cifra no navegador com Web Crypto. Para producao, a
              derivacao principal deve evoluir para Argon2id via libsodium.js e
              anexos grandes com streaming.
            </p>
          </div>
        </div>
        <div className="workbench">
          <div className="form-panel">
            <div className="panel-pad">
              <div className="field">
                <label htmlFor="secret">Nota privada</label>
                <textarea
                  id="secret"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="passphrase">Passphrase local</label>
                <input
                  id="passphrase"
                  type="password"
                  value={passphrase}
                  onChange={(event) => setPassphrase(event.target.value)}
                />
              </div>
              {error ? <p className="section-lead">{error}</p> : null}
              <div className="copy-row">
                <button className="button primary" onClick={handleEncrypt} disabled={isEncrypting}>
                  <KeyRound size={18} />
                  {isEncrypting ? "Cifrando..." : "Cifrar localmente"}
                </button>
                <button className="button" onClick={downloadEnvelope} disabled={!envelope}>
                  <Download size={18} />
                  Baixar envelope
                </button>
              </div>
            </div>
          </div>
          <div className="result-panel">
            <div className="panel-pad">
              <strong>Envelope que iria para a API</strong>
              <p className="section-lead">
                O servidor receberia este JSON e os metadados operacionais, nao a nota
                em claro.
              </p>
            </div>
            <pre className="result-code">{envelopePreview}</pre>
          </div>
        </div>
      </section>

      <section className="section" id="canais">
        <div className="section-head">
          <div>
            <h2>Canais como notificacao</h2>
            <p className="section-lead">
              Push, e-mail e bots conduzem o fluxo. Segredo sensivel fica em pacote
              cifrado, aberto no cliente ou por chave publica do destinatario.
            </p>
          </div>
        </div>
        <div className="matrix">
          {channels.map(([name, text, label]) => (
            <div className="channel" key={name}>
              <strong>{name}</strong>
              <p>{text}</p>
              <span className="tag">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="roadmap">
        <div className="section-head">
          <div>
            <h2>Roadmap executavel</h2>
            <p className="section-lead">
              O escopo prioriza aprender construindo, sem prometer acesso a contas de
              terceiros nem verificacao oficial de obito no MVP.
            </p>
          </div>
        </div>
        <div className="roadmap">
          {roadmap.map(([phase, text, estimate]) => (
            <article className="roadmap-item" key={phase}>
              <strong>{phase}</strong>
              <div>
                <h3>{text}</h3>
              </div>
              <span className="tag">{estimate}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="cafe">
        <div className="donation-panel donation-wrap">
          <div className="panel-pad">
            <p className="eyebrow">
              <Coffee size={18} />
              Compre um cafe
            </p>
            <h2>Apoie o desenvolvimento aberto</h2>
            <p className="section-lead">
              O projeto pode combinar free tier util, planos pagos e apoio direto para
              financiar auditoria, documentacao, infraestrutura e revisoes juridicas.
            </p>
            <div className="copy-row">
              <span className="mono">Pix: {pixKey}</span>
              <span className="mono">Bitcoin: {bitcoinAddress}</span>
            </div>
          </div>
          <div className="panel-pad">
            <div className="qr-box" aria-label="QR Code Pix">
              <QRCodeSVG value={pixKey} size={210} level="M" includeMargin />
              <p className="section-lead">
                <QrCode size={16} /> QR Code da chave Pix aleatoria
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Stack tecnica">
        <div className="grid">
          <article className="card">
            <span className="icon-box">
              <Smartphone size={21} />
            </span>
            <h3>PWA primeiro</h3>
            <p>Next.js, Web Push, passkeys e instalacao web antes de wrapper mobile.</p>
          </article>
          <article className="card">
            <span className="icon-box">
              <Mail size={21} />
            </span>
            <h3>Notificacoes auditaveis</h3>
            <p>Resend no MVP, Mailpit local e Postal como rota self-host futura.</p>
          </article>
          <article className="card">
            <span className="icon-box">
              <MessageCircle size={21} />
            </span>
            <h3>Bots sem segredo</h3>
            <p>Telegram e WhatsApp avisam e redirecionam para o portal seguro.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <p>
          If I Die nao substitui testamento, inventario, ordem judicial ou politicas
          de Google, Apple, Meta, bancos e provedores.
        </p>
      </footer>
    </main>
  );
}
