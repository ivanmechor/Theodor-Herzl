# Conversa com Theodor Herzl

Site para uma atividade didatica em que estudantes conversam com uma persona historica de Theodor Herzl. A interface envia as mensagens para uma API `/api/chat`, que encaminha a conversa para um webhook do n8n sem expor a URL real no navegador.

## Configurar o webhook

1. Crie no n8n um workflow com um Webhook usando metodo `POST`.
2. Conecte o webhook ao seu fluxo de IA.
3. Faça o workflow responder com JSON em um destes formatos:

```json
{ "output": "resposta do personagem" }
```

Tambem funcionam as chaves `reply`, `message`, `text`, `response`, `answer` ou `content`.

4. No site, `config.js` deve apontar para a API local:

```js
window.HERZL_CHAT_CONFIG = {
  webhookUrl: "/api/chat"
};
```

O site envia para o n8n:

```json
{
  "sessionId": "id persistente do aluno",
  "chatInput": "pergunta digitada",
  "history": [{ "role": "user", "content": "..." }],
  "systemPrompt": "prompt completo da persona"
}
```

## Publicar na Vercel

1. Importe este repositorio na Vercel.
2. Em Settings > Environment Variables, crie:

```txt
N8N_WEBHOOK_URL=https://SEU-N8N/webhook/SEU-WEBHOOK
```

3. Faca o deploy.

O navegador dos alunos chamara apenas `/api/chat`. A URL real do n8n fica guardada como variavel de ambiente na Vercel.

## Testar localmente

Rode um servidor estatico na pasta do projeto:

```bash
$env:N8N_WEBHOOK_URL="https://SEU-N8N/webhook/SEU-WEBHOOK"
node dev-server.js
```

Abra `http://localhost:4173`.

## Publicar gratis

Opcoes simples:

- GitHub Pages: publique esta pasta em um repositorio e ative Pages usando GitHub Actions.
- Netlify: arraste a pasta do projeto para o painel "Deploy manually".
- Vercel: importe o repositorio e configure a variavel `N8N_WEBHOOK_URL`.

O site nao precisa de build.

## Imagem

O retrato usado pelo site fica em `assets/theodor-herzl-portrait.png`.
