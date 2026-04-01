# 🤖 Guía de Setup — Agente IA Reservas La.Cúpula

## Stack elegido (mínimo coste)

| Herramienta | Para qué | Coste estimado |
|---|---|---|
| **n8n** (self-hosted en tu PC/VPS) | Motor de automatización | **Gratis** |
| **Twilio** | Recibir mensajes WhatsApp | ~1€/mes número + 0,005€/msg |
| **OpenAI GPT-4o-mini** | IA conversacional | ~0,15$/1M tokens ≈ **casi gratis** |
| **Google Sheets** | Base de datos reservas | **Gratis** |
| **ngrok** (solo pruebas) | Exponer n8n en internet | **Gratis** |

**Coste total real: ≈ 2-5 € / mes**

---

## Paso 1 — Instalar n8n

```bash
# Opción A: con npm (necesitas Node.js 18+)
npm install -g n8n
n8n start

# Opción B: con Docker (recomendado para producción)
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Accede a **http://localhost:5678** y crea tu cuenta.

---

## Paso 2 — Configurar Twilio para WhatsApp

1. Crea cuenta en [twilio.com](https://twilio.com) (tienes crédito gratuito de prueba)
2. Ve a **Messaging → Try it out → Send a WhatsApp message**
3. Sigue el sandbox de WhatsApp para pruebas (gratis)
4. Para producción: solicita un número de WhatsApp Business (~1€/mes)
5. En **Messaging → Settings → WhatsApp Sandbox Settings**, pon:
   - When a message comes in: `https://TU-DOMINIO/webhook/whatsapp-webhook`
   - HTTP Method: `POST`

> Para pruebas en local usa **ngrok**:
> ```bash
> ngrok http 5678
> # Te dará una URL tipo: https://abc123.ngrok.io
> # Usa: https://abc123.ngrok.io/webhook/whatsapp-webhook
> ```

---

## Paso 3 — Configurar OpenAI

1. Crea cuenta en [platform.openai.com](https://platform.openai.com)
2. Ve a **API Keys** → crea una nueva clave
3. Carga mínimo 5€ de crédito (durará meses con el uso de un restaurante)
4. En n8n: **Settings → Credentials → New → OpenAI API** → pega la clave

---

## Paso 4 — Configurar Google Sheets

1. Crea una hoja en Google Sheets con estas columnas en la fila 1:
   ```
   Fecha_Solicitud | Nombre | Fecha_Reserva | Hora | Personas | Telefono | Notas | Estado
   ```
2. Copia el ID de la hoja desde la URL:
   `https://docs.google.com/spreadsheets/d/**ESTE_ES_EL_ID**/edit`
3. En n8n: **Settings → Credentials → New → Google Sheets OAuth2**
4. En el workflow, reemplaza `TU_GOOGLE_SHEET_ID_AQUI` con tu ID real

---

## Paso 5 — Importar el Workflow

1. En n8n, ve a **Workflows → Import from file**
2. Selecciona el archivo `workflow_reservas.json` de esta carpeta
3. En el nodo **"Responder WhatsApp"**, cambia:
   - `from`: `whatsapp:+TU_NUMERO_TWILIO` → tu número real de Twilio
4. Activa el workflow con el toggle de arriba a la derecha

---

## Paso 6 — Prueba

Envía desde tu móvil al sandbox de WhatsApp de Twilio:
```
Hola, quiero hacer una reserva para el sábado
```

El agente te pedirá los datos y al completarlos:
- ✅ Enviará confirmación por WhatsApp
- ✅ Guardará la reserva en Google Sheets
- ✅ El restaurante ve las reservas en tiempo real

---

## Flujo completo

```
Cliente → WhatsApp → Twilio → n8n Webhook
                                    ↓
                              GPT-4o-mini
                          (gestiona conversación)
                                    ↓
                        ¿Reserva completa?
                        /                \
                       SÍ                NO
                        ↓                 ↓
               Google Sheets       Responde info
               + Confirmación      (horario, carta...)
               WhatsApp
```

---

## Para llamadas telefónicas (opcional, +1€/mes)

Si quieres que también funcione por **llamada de voz**:

1. En Twilio compra un número de teléfono (~1€/mes)
2. Usa **Twilio + ElevenLabs** (voz muy natural, plan gratuito disponible)
3. O usa **Vapi.ai** — plataforma especializada en agentes de voz IA
   - Plan gratuito con 10 min/mes, luego ~0,05$/min
   - Muy fácil de configurar, ya incluye STT + LLM + TTS

> **Recomendación**: empieza solo con WhatsApp (más barato y los clientes prefieren texto). Añade llamadas después si hay demanda.

---

## Soporte

- Documentación n8n: https://docs.n8n.io
- Twilio WhatsApp: https://www.twilio.com/docs/whatsapp
- OpenAI API: https://platform.openai.com/docs
