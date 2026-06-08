require('dotenv').config();

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/submit', async (req, res) => {
  const { name, phone, formName } = req.body || {};

  if (!phone || !formName) {
    return res.status(400).json({ ok: false, error: 'phone and formName are required' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_IDS || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || !chatIds.length || token === 'here' || chatIds.some((id) => id === 'here')) {
    return res.status(500).json({ ok: false, error: 'Telegram is not configured' });
  }

  const datetime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const text = [
    '🔔 Новая заявка!',
    `📋 Форма: ${formName}`,
    `👤 Имя: ${name || '—'}`,
    `📞 Телефон: ${phone}`,
    `🕐 Время: ${datetime}`
  ].join('\n');

  try {
    for (const chatId of chatIds) {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        return res.status(502).json({ ok: false, error: 'Telegram API error' });
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
