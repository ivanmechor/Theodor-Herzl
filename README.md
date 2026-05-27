# Conversa com Theodor Herzl

Site estatico para uma atividade didatica em que estudantes conversam com uma persona historica de Theodor Herzl. A interface envia as mensagens para um webhook do n8n e exibe a resposta ao vivo.

## Configurar o webhook

1. Crie no n8n um workflow com um Webhook usando metodo `POST`.
2. Conecte o webhook ao seu fluxo de IA.
3. Faça o workflow responder com JSON em um destes formatos:

```json
{ "output": "resposta do personagem" }
```

Tambem funcionam as chaves `reply`, `message`, `text`, `response`, `answer` ou `content`.

4. Edite `config.js` e preencha:

```js
window.HERZL_CHAT_CONFIG = {
  webhookUrl: "https://SEU-N8N/webhook/SEU-WEBHOOK"
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

## Testar localmente

Rode um servidor estatico na pasta do projeto:

```bash
node dev-server.js
```

Abra `http://localhost:4173`.

## Publicar gratis

Opcoes simples:

- GitHub Pages: publique esta pasta em um repositorio e ative Pages usando GitHub Actions.
- Netlify: arraste a pasta do projeto para o painel "Deploy manually".
- Vercel: importe o repositorio como projeto estatico.

O site nao precisa de build.

## Imagem

O retrato usado pelo site fica em `assets/theodor-herzl-portrait.png`.
