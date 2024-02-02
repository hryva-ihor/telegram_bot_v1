// require("dotenv").config();
// const TelegramBot = require("node-telegram-bot-api");
// const token = process.env.TOKEN;
// const bot = new TelegramBot(token, { polling: true });

// let isSurveyActive = false;
// let currentQuestion = 0;

// const surveyQuestions = [
//   {
//     question: "Яке ваше улюблене кольору?",
//     options: ["Червоний", "Зелений", "Синій"],
//   },
//   {
//     question: "Як ви оцінюєте цей бот?",
//     options: ["Відмінно", "Добре", "Задовільно"],
//   },
// ];

// // Функція для створення inline клавіатури
// function createInlineKeyboard(options) {
//   return {
//     reply_markup: {
//       inline_keyboard: options.map((option) => [
//         { text: option, callback_data: option, callback_game: {} },
//       ]),
//     },
//     parse_mode: "HTML",
//   };
// }

// // Обробник команди /start
// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   const inlineKeyboard = createInlineKeyboard(["Почати опитування"]);

//   bot.sendMessage(
//     chatId,
//     "Вітаю! Натисніть кнопку, щоб розпочати опитування:",
//     inlineKeyboard
//   );
// });

// // Обробник натискань на кнопки в inline клавіатурі
// bot.on("callback_query", (query) => {
//   const chatId = query.message.chat.id;
//   const buttonData = query.data;

//   if (buttonData === "Почати опитування") {
//     isSurveyActive = true;
//     currentQuestion = 0;

//     // Виправлення: Видаляємо анімацію обробки
//     bot.answerCallbackQuery(query.id, { animation: "empty" });

//     // Затримка перед відправленням першого питання
//     setTimeout(() => {
//       sendQuestion(chatId);
//     }, 500); // Можна спробувати зіграти з цим значенням
//   } else {
//     // Виправлення: Видаляємо анімацію обробки
//     bot.answerCallbackQuery(query.id);

//     saveAnswer(chatId, buttonData);
//   }
// });

// // Функція для відправлення питання та варіантів відповіді
// function sendQuestion(chatId) {
//   const question = surveyQuestions[currentQuestion].question;
//   const options = surveyQuestions[currentQuestion].options;

//   const keyboard = createInlineKeyboard(options);

//   bot.sendMessage(chatId, `<b>${question}</b>`, keyboard);
// }

// // Функція для збереження відповіді користувача
// function saveAnswer(chatId, answer) {
//   // bot.sendMessage(chatId, `Ваша відповідь: ${answer}`);

//   // Перевірити, чи є ще питання у опитуванні
//   currentQuestion++;
//   if (currentQuestion < surveyQuestions.length) {
//     sendQuestion(chatId);
//   } else {
//     isSurveyActive = false;
//     bot.sendMessage(chatId, "Дякую за участь у опитуванні!");
//   }
// }

// // Додайте експортовану функцію для Vercel
// module.exports = async (req, res) => {
//   try {
//     // ваш код обробки запитань або інша логіка
//     res.status(200).json({ message: "bot is working" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TOKEN;
const bot = new TelegramBot(token);

app.use(bodyParser.json());

let isSurveyActive = false;
let currentQuestion = 0;

const surveyQuestions = [
  {
    question: "Яке ваше улюблене кольору?",
    options: ["Червоний", "Зелений", "Синій"],
  },
  {
    question: "Як ви оцінюєте цей бот?",
    options: ["Відмінно", "Добре", "Задовільно"],
  },
];

// Функція для створення inline клавіатури
function createInlineKeyboard(options) {
  return {
    reply_markup: {
      inline_keyboard: options.map((option) => [
        { text: option, callback_data: option, callback_game: {} },
      ]),
    },
    parse_mode: "HTML",
  };
}

// Обробник команди /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const inlineKeyboard = createInlineKeyboard(["Почати опитування"]);

  bot.sendMessage(
    chatId,
    "Вітаю! Натисніть кнопку, щоб розпочати опитування:",
    inlineKeyboard
  );
});

// Обробник натискань на кнопки в inline клавіатурі
bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const buttonData = query.data;

    if (buttonData === "Почати опитування") {
      isSurveyActive = true;
      currentQuestion = 0;

      // Виправлення: Видаляємо анімацію обробки
      await bot.answerCallbackQuery(query.id, { animation: "empty" });

      // Затримка перед відправленням першого питання
      setTimeout(() => {
        sendQuestion(chatId);
      }, 500);
    } else {
      await bot.answerCallbackQuery(query.id);
      saveAnswer(chatId, buttonData);
    }
  } catch (error) {
    console.error("Error during callback query processing:", error);
  }
});

// Функція для відправлення питання та варіантів відповіді
async function sendQuestion(chatId) {
  try {
    const question = surveyQuestions[currentQuestion].question;
    const options = surveyQuestions[currentQuestion].options;

    const keyboard = createInlineKeyboard(options);

    await bot.sendMessage(chatId, `<b>${question}</b>`, keyboard);
  } catch (error) {
    console.error("Error during sending question:", error);
  }
}

// Функція для збереження відповіді користувача
async function saveAnswer(chatId, answer) {
  try {
    // bot.sendMessage(chatId, `Ваша відповідь: ${answer}`);

    // Перевірити, чи є ще питання у опитуванні
    currentQuestion++;
    if (currentQuestion < surveyQuestions.length) {
      await sendQuestion(chatId);
    } else {
      isSurveyActive = false;
      await bot.sendMessage(chatId, "Дякую за участь у опитуванні!");
    }
  } catch (error) {
    console.error("Error during saving answer:", error);
  }
}

// Ваші решта коду, якщо є, тут

// Замість bot.polling(), слід використовувати слухання запитів для Webhook
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, this is your Telegram bot!" });
});

// export the express app
module.exports = app;
