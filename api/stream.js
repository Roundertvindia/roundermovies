const axios = require("axios");

// 🛡️ Telegram BOT Token (hardcoded)
const BOT_TOKEN = "7404727496:AAHnXJOSl4_GhSriQC3WK2hhChNJ3-WOCDU";

module.exports = async (req, res) => {
  const { id } = req.query;
  const fileId = await getFileIdFromGitHub(id);

  if (!fileId) {
    return res.status(404).send("Stream not found");
  }

  const telegramUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${await getTelegramFilePath(fileId)}`;
  res.redirect(telegramUrl);
};

// 🔍 Get file_id from GitHub JSON
async function getFileIdFromGitHub(slug) {
  try {
    const res = await axios.get("https://raw.githubusercontent.com/Roundertvindia/Roundermovies/main/stream-db.json");
    const db = res.data;
    const found = db.find(item => item.id === slug);
    return found?.file_id;
  } catch (err) {
    return null;
  }
}

// 🔍 Get file_path from Telegram
async function getTelegramFilePath(fileId) {
  const res = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
  return res.data.result.file_path;
}
