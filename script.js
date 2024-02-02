// const token = `6755412982:AAFu2NUC7jsSJjacCCPRVced-A5pyZHie40`;

{
  //   const TelegramBot = require("node-telegram-bot-api");
  // const token = `6755412982:AAFu2NUC7jsSJjacCCPRVced-A5pyZHie40`;
  // const bot = new TelegramBot(token, { polling: true });
  // let isSurveyActive = false;
  // let currentQuestion = 0;
  // const surveyQuestions = [
  //   {
  //     question: "Яке ваше улюблене кольору?",
  //     options: ["Червоний 🌟", "Зелений 🌟", "Синій 🌟"],
  //   },
  //   {
  //     question: "Як ви оцінюєте цей бот?",
  //     options: ["Відмінно 🌟", "Добре 🌟", "Задовільно🌟"],
  //   },
  // ];
  // // Отримати ID чату для користувача
  // function getChatId(msg) {
  //   return msg.chat.id;
  // }
  // // Обробник команди /start
  // bot.onText(/\/start/, (msg) => {
  //   const chatId = getChatId(msg);
  //   const startKeyboard = {
  //     reply_markup: {
  //       keyboard: [["Почати опитування"]],
  //       one_time_keyboard: true,
  //       resize_keyboard: true,
  //     },
  //   };
  //   bot.sendMessage(
  //     chatId,
  //     'Вітаю! Я бот для опитувань. Натисніть "Почати опитування", щоб розпочати.',
  //     startKeyboard
  //   );
  // });
  // // Обробник кнопки "Почати опитування"
  // bot.onText(/Почати опитування/, (msg) => {
  //   const chatId = getChatId(msg);
  //   isSurveyActive = true;
  //   currentQuestion = 0;
  //   sendQuestion(chatId);
  // });
  // // Обробник текстових повідомлень
  // bot.on("text", (msg) => {
  //   const chatId = getChatId(msg);
  //   const response = msg.text;
  //   if (response === "Почати опитування" && !isSurveyActive) {
  //     // Викликати обробник кнопки "Почати опитування"
  //     isSurveyActive = true;
  //     currentQuestion = 0;
  //     sendQuestion(chatId);
  //   } else if (isSurveyActive) {
  //     saveAnswer(chatId, response);
  //     if (currentQuestion < surveyQuestions.length) {
  //       sendQuestion(chatId);
  //     } else {
  //       isSurveyActive = false;
  //       bot.sendMessage(chatId, "Дякую за участь у опитуванні!");
  //     }
  //   }
  // });
  // // Функція для відправлення питання та варіантів відповіді
  // function sendQuestion(chatId) {
  //   const question = surveyQuestions[currentQuestion].question;
  //   const options = surveyQuestions[currentQuestion].options;
  //   const keyboard = {
  //     reply_markup: {
  //       keyboard: [options],
  //       one_time_keyboard: true,
  //       resize_keyboard: true,
  //     },
  //   };
  //   bot.sendMessage(chatId, question, keyboard);
  // }
  // // Функція для збереження відповіді користувача
  // function saveAnswer(chatId, answer) {
  //   // bot.sendMessage(chatId, `Ваша відповідь: ${answer}`);
  //   currentQuestion++;
  // }
}
const TelegramBot = require("node-telegram-bot-api");
const token = `6755412982:AAFu2NUC7jsSJjacCCPRVced-A5pyZHie40`;
const bot = new TelegramBot(token, { polling: true });

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
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const buttonData = query.data;

  if (buttonData === "Почати опитування") {
    isSurveyActive = true;
    currentQuestion = 0;

    // Виправлення: Видаляємо анімацію обробки
    bot.answerCallbackQuery(query.id, { animation: "empty" });

    // Затримка перед відправленням першого питання
    setTimeout(() => {
      sendQuestion(chatId);
    }, 500); // Можна спробувати зіграти з цим значенням
  } else {
    // Виправлення: Видаляємо анімацію обробки
    bot.answerCallbackQuery(query.id);

    saveAnswer(chatId, buttonData);
  }
});

// Функція для відправлення питання та варіантів відповіді
function sendQuestion(chatId) {
  const question = surveyQuestions[currentQuestion].question;
  const options = surveyQuestions[currentQuestion].options;

  const keyboard = createInlineKeyboard(options);

  bot.sendMessage(chatId, `<b>${question}</b>`, keyboard);
}

// Функція для збереження відповіді користувача
function saveAnswer(chatId, answer) {
  // bot.sendMessage(chatId, `Ваша відповідь: ${answer}`);

  // Перевірити, чи є ще питання у опитуванні
  currentQuestion++;
  if (currentQuestion < surveyQuestions.length) {
    sendQuestion(chatId);
  } else {
    isSurveyActive = false;
    bot.sendMessage(chatId, "Дякую за участь у опитуванні!");
  }
}
