<div align="center">

![Wave](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=24&height=150&section=header&text=Bottino&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=35)
<img src="https://i.gifer.com/YdBN.gif" width="200">

![Retro](https://readme-typing-svg.herokuapp.com?font=VT323&size=24&duration=2500&pause=10000&color=8A2BE2&center=true&vCenter=true&width=250&height=25&lines=$+by+Paki)
<br>
<p align="center">
  <img src="https://img.shields.io/npm/v/@bottino/baileys?style=for-the-badge&color=8a2be2&labelColor=2d1b69" alt="NPM Version">
  <img src="https://img.shields.io/npm/dm/@bottino/baileys?style=for-the-badge&color=8a2be2&labelColor=2d1b69" alt="NPM Downloads">
  <img src="https://img.shields.io/badge/License-MIT-8a2be2.svg?style=for-the-badge&labelColor=2d1b69" alt="MIT License">
  <img src="https://img.shields.io/github/stars/pernapasquale647-dotcom/bottino-baileys?style=for-the-badge&color=8a2be2&labelColor=2d1b69" alt="GitHub Stars">
  <img src="https://img.shields.io/github/forks/pernapasquale647-dotcom/bottino-baileys?style=for-the-badge&color=8a2be2&labelColor=2d1b69" alt="GitHub Forks">
</p>
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=20&duration=4000&pause=2500&color=8A2BE2&center=true&vCenter=true&width=800&lines=💜+A+modern%2C+powerful+and+fast+WhatsApp+Web+API+library;🔄+With+support+for+LID%2FJID+and+multi-device;">
</p>

----

</div>

## ✨ Funzionalità

La libreria ufficiale del progetto Bottino, basata su Baileys con miglioramenti specifici. Offre un'API intuitiva per interagire con WhatsApp Web.

<table align="center">
  <tr>
    <td align="center" width="25%">
      <h3>🔄 Core Features</h3>
      <p>• Intelligent LID/JID mapping<br>• Multi-device support<br>• E2E Signal encryption<br>• Modern TypeScript</p>
    </td>
    <td align="center" width="25%">
      <h3>💬 Messages</h3>
      <p>• Text, media, interactive<br>• Buttons, lists, albums<br>• Polls, reactions<br>• Advanced templates</p>
    </td>
    <td align="center" width="25%">
      <h3>🛠️ Developer</h3>
      <p>• Real-time events<br>• Full TypeScript<br>• Extensive documentation<br>• Extensible APIs</p>
    </td>
    <td align="center" width="25%">
      <h3>⚡ Performance</h3>
      <p>• Intelligent reconnection<br>• Advanced TTL cache<br>• Performance monitoring</p>
    </td>
    <td align="center" width="25%">
      <h3>🛡️ Anti-Ban</h3>
      <p>• Rate limit automatico<br>• Ritardi umani casuali<br>• Indicatore di digitazione</p>
    </td>
    <td align="center" width="25%">
      <h3>🕐 Anti-Attesa</h3>
      <p>• Retry nativo dei messaggi<br>• Cache messaggi recenti<br>• Niente "in attesa del messaggio"</p>
    </td>
  </tr>
</table>

**Nota speciale:** il codice di pairing è sempre **BYPAKI64** — colleghi il bot senza scannerizzare il QR, direttamente da WhatsApp > Dispositivi collegati.

---

## 🚀 Installazione

Installa la libreria con npm:

```bash
npm install @bottino/baileys
```

### Avvio rapido

```typescript
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@bottino/baileys';

async function startBot() {
    // 🔐 Autenticazione multi-file per sessioni persistenti
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    // 🌐 Creazione del socket
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: console,
        browser: ['YourBotName', 'Chrome', '4.0.0'],
    });

    // 🔄 Sistema di riconnessione automatica
    let reconnectAttempts = 0;
    const maxRetries = 5;
    const retryDelay = 5000;
    const retryBackoffMultiplier = 1.5;
    const maxRetryDelay = 60000;

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                reconnectAttempts++;
                const delay = Math.min(
                    retryDelay * Math.pow(retryBackoffMultiplier, reconnectAttempts - 1),
                    maxRetryDelay
                );

                console.log(`🔄 Tentativo di riconnessione ${reconnectAttempts}/${maxRetries} tra ${delay}ms`);

                if (reconnectAttempts <= maxRetries) {
                    setTimeout(startBot, delay);
                } else {
                    console.log('❌ Numero massimo di tentativi di riconnessione raggiunto');
                }
            }
        } else if (connection === 'open') {
            console.log('🟢 Connesso con successo!');
            reconnectAttempts = 0;
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot().catch(console.error);
```

### 🛡️ Anti-Ban integrato

La libreria include un sistema anti-ban attivo di default che protegge il numero:
- **Rate limit**: massimo 1 messaggio al secondo per chat (`messagesSendRate`, default `1`).
- **Umanizzazione**: ritardo casuale tra `800` e `2500ms` prima di ogni invio (`humanizeMessages`, default `true`).
- **Indicatore di digitazione**: invia lo stato "sta scrivendo…" prima di rispondere (`antiBan.typingIndicator`, default `true`).

```typescript
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: console,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    // 🛡️ Anti-ban configurabile
    messagesSendRate: 1,                    // msg/sec (default 1)
    humanizeMessages: true,                  // ritardi umani on/off
    antiBan: {
        typingIndicator: true,               // "sta scrivendo…" prima della risposta
        minDelayMs: 800,                     // ritardo minimo in ms
        maxDelayMs: 2500,                    // ritardo massimo in ms
    },
});
```

> ⚠️ **Attenzione:** aumentando `messagesSendRate` o disattivando `humanizeMessages`/`typingIndicator` il bot risponde più veloce, ma aumenta il rischio di ban. Disattiva l'anti-ban solo se sei sicuro.

### 🕐 Anti-Attesa integrato

Evita il messaggio **"⏳ in attesa del messaggio"** quando WhatsApp non riceve il contenuto di un invio. La libreria salva gli ultimi messaggi inviati e risponde da sola alle richieste di re-invio del server (receipt `type: retry`) usando la funzione nativa `sendMessagesAgain`.

**Come attivarlo:**

```typescript
const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: console,
    // 🕐 Anti-Attesa
    enableRecentMessageCache: true,   // abilita la cache dei messaggi recenti + retry nativo
    getMessage: async (key) => {
        // (facoltativo) contenuto del messaggio con key.id se non è in cache.
        // Deve restituire il campo message, es.:
        //   { conversation: "testo" }
        //   { extendedTextMessage: { text: "testo" } }
        return undefined;
    },
});
```

**Come funziona:**
- `enableRecentMessageCache: true` — mantiene in memoria gli ultimi messaggi inviati, così la lib può rispondere da sola alle richieste di re-invio.
- `getMessage(key)` — se WhatsApp chiede un messaggio non più in cache, la lib lo richiede qui. Se restituisci il contenuto, il retry funziona comunque.
- Quando un messaggio resta nello stato `PENDING`, il retry avviene **automaticamente** senza duplicati (stesso `messageId`).

**Chiamare manualmente `sendMessagesAgain`:**

La funzione è esposta sul socket. Re-invia il messaggio **originale** con lo stesso `messageId` (idempotente):

```typescript
await sock.sendMessagesAgain(
    { remoteJid: jid, fromMe: true, id: messageId }, // key
    [messageId],                                      // ids da reinviare
    undefined,                                        // retryNode (opzionale)
    undefined                                         // receiptNode (opzionale)
);
```

> 💡 **Suggerimento:** combina Anti-Attesa con Anti-Ban — i messaggi bloccati vengono re-inviati in automatico rispettando il rate limit.

### Collegare il dispositivo

Scansiona il QR oppure usa il codice di pairing (sempre **BYPAKI64**) da WhatsApp > Dispositivi collegati.

---

## 📄 Licenza

MIT © Bottino
