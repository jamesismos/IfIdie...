# If I Die

SaaS open source de continuidade digital com foco em check-ins configuraveis,
cofre criptografado no cliente e entrega gradual de pacotes cifrados.

## Stack inicial

- Next.js + React + TypeScript para PWA e interface web.
- Web Crypto API para a demonstracao de cifra client-side.
- Vercel Analytics habilitado no layout global.
- AdSense configurado com `ca-pub-3090285265842642`.
- Postgres, MinIO e Mailpit definidos em `docker-compose.yml` para o backend local.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Observacao de seguranca

O prototipo usa PBKDF2 + AES-GCM no navegador para demonstrar o envelope. Antes
de producao, a derivacao principal deve migrar para Argon2id via libsodium.js,
anexos grandes devem usar streaming, e o threat model precisa virar criterio de
teste e auditoria.
