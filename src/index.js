import { config } from "dotenv";
config();
import { Bot, InlineKeyboard, session } from "grammy";
import {
  categoriesKeyCommands,
  categoriesKey,
  initialKeyCommands,
  initialKey,
} from "./keyboards.js";
import { products } from "./products.js";

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(
  session({
    initial: () => ({
      products: {},
      orderHistory: [],
    }),
  })
);

// Place where bot starts working
bot.command("start", async (ctx) => {
  ctx.api.sendPhoto(
    ctx.chat.id,
    "https://marketing.uz/brend-goda-2021/uploads/works/covers/cac0ac04cd2db09bf8bc76046ec7389b.jpg",
    {
      caption: `Welcome to our bot\nHow can we help you?`,
      reply_markup: initialKey,
    }
  );
});

// This piece of code is responsible for button named "Order📝"
bot.hears(initialKeyCommands.ORDER, async (ctx) => {
  await ctx.reply("Please choose the category, here is the menu:");
  ctx.api.sendPhoto(
    ctx.chat.id,
    "https://scontent.ftas7-1.fna.fbcdn.net/v/t1.6435-9/118836044_2145216755611209_4945647734055661485_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=a0f3c3&_nc_ohc=O0M5H3yE1Q0Q7kNvgFO-SUB&_nc_ht=scontent.ftas7-1.fna&_nc_gid=AVW6S10Jw8LEdadeRxLoEh6&oh=00_AYCB_ZYivUyZsmtOdpktYtf3eG714_K21bCja6xODxq5LQ&oe=67162ADC",
    {
      reply_markup: categoriesKey,
    }
  );
});

// Now here starts piece of code which is responsible for "Basket🛒" button
const clearBasketKey = new InlineKeyboard()
  .text("Clear Basket🛒", "clear-basket")
  .row()
  .text("Confirm and Order✅", "confirm-order");

bot.hears(initialKeyCommands.BASKET, async (ctx) => {
  const basket = ctx.session.products;

  if (Object.keys(basket).length === 0) {
    return ctx.reply("Your basket is empty");
  }

  let basketMessage = "Your basket:\n";
  let totalCost = 0;

  for (const category in basket) {
    basketMessage += `\n${category}:\n`;
    for (const id in basket[category]) {
      const prod = basket[category][id];
      const itemCost = prod.quantity * prod.cost;
      basketMessage += `- ${prod.name} ${prod.quantity}x, ${prod.cost} for 1\nTotal: ${itemCost}\n`;
      totalCost += itemCost;
    }
  }

  basketMessage += `\nTotal Cost: ${totalCost} UZS`;

  ctx.reply(basketMessage, {
    reply_markup: clearBasketKey,
  });
});

// After "Basket🛒" button we have "Order History📖" button and this piece of code responsible for it
bot.hears(initialKeyCommands.ORDERHISTORY, async (ctx) => {
  const orderHistory = ctx.session.orderHistory || [];

  if (orderHistory.length === 0) {
    return ctx.reply("You have no previous orders.");
  }

  let historyMessage = "Here are your last 3 orders:\n";

  orderHistory.forEach((order, index) => {
    historyMessage += `\nOrder ${index + 1} (Date: ${order.date}):\n`;
    order.order.forEach((item) => {
      historyMessage += `- ${item.name} ${item.quantity}x, ${item.total} UZS\n`;
    });
    historyMessage += `Total: ${order.totalCost} UZS\n`;
  });

  ctx.reply(historyMessage);
});

bot.callbackQuery("confirm-order", async (ctx) => {
  const basket = ctx.session.products;

  if (!basket || Object.keys(basket).length === 0) {
    return ctx.answerCallbackQuery("Your basket is empty");
  }

  let orderDetails = [];
  let totalCost = 0;

  for (const category in basket) {
    for (const id in basket[category]) {
      const prod = basket[category][id];
      const itemCost = prod.quantity * prod.cost;
      orderDetails.push({
        name: prod.name,
        quantity: prod.quantity,
        total: itemCost,
      });
      totalCost += itemCost;
    }
  }

  ctx.session.orderHistory = ctx.session.orderHistory || [];

  ctx.session.orderHistory.push({
    order: orderDetails,
    totalCost,
    date: new Date().toLocaleString(),
  });

  if (ctx.session.orderHistory.length > 3) {
    ctx.session.orderHistory.shift();
  }

  let orderMessage = "Your order has been confirmed:\n";
  orderDetails.forEach((item) => {
    orderMessage += `- ${item.name} ${item.quantity}x, Total: ${item.total} UZS\n`;
  });
  orderMessage += `\nTotal Cost: ${totalCost} UZS`;

  // Ask the user to share their location
  await ctx.reply(orderMessage);
  await ctx.reply("Please share your location for delivery", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Share Location📍",
            request_location: true,
          },
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });

  // Clear basket after confirming order
  ctx.session.products = {};
  ctx.answerCallbackQuery("Your order has been confirmed and placed");
});

// Handle location message from user
bot.on("message:location", async (ctx) => {
  const userLocation = ctx.message.location;

  // You can implement any custom logic here to verify the user's location
  const isLocationValid = true; // Replace with real validation logic if needed

  if (!isLocationValid) {
    return ctx.reply("The provided location is not valid. Please try again");
  }

  // Send delivery status updates
  await ctx.reply("Your delivery-man is on the way");

  // Wait for 5 seconds before sending the next message
  setTimeout(async () => {
    await ctx.reply("Your delivery-man arrived, please get your order", {
      reply_markup: new InlineKeyboard().text("Get Order✅", "get-order"),
    });
  }, 5000);
});

// Handle "Get Order" button press
bot.callbackQuery("get-order", (ctx) => {
  ctx.answerCallbackQuery("Thank you! Enjoy your meal😊");
  ctx.reply("Thank you for your order😊 We hope to serve you again", {
    reply_markup: initialKey,
  });
});

// Handle "clear-basket" callback query
bot.callbackQuery("clear-basket", (ctx) => {
  ctx.session.products = {};
  ctx.answerCallbackQuery("Your basket has been cleared");
  ctx.reply("Your basket is empty now");
});

// After "Order History📖" button we have piece of code which is responsible for "Mobile Apps📱" button
bot.hears(initialKeyCommands.MOBILEAPPS, async (ctx) => {
  const message1 = `[android](https://play.google.com/store/apps/details?id=uz.makfood.service.evos&hl=ru&gl=US)`;
  const message2 = `[iphone](https://apps.apple.com/us/app/evos-uz/id1595897228)`;

  ctx.reply(
    "Here is our mobile apps for " + message1 + " and for " + message2,
    { parse_mode: "Markdown" }
  );
});

// Here is another piece of code which is responsible for button named "About usℹ️"
bot.hears(initialKeyCommands.ABOUT, async (ctx) => {
  const webSiteKey = new InlineKeyboard().url(
    "Visit Website🌐",
    "https://evos.uz"
  );

  ctx.api.sendPhoto(
    ctx.chat.id,
    "https://admin.evos.uz/uploads/banner1_6f89341462.png",
    {
      caption: `About us\nDid you know that the very first branch of the company was opened back in 2006 and is successfully operating to this day? Over the course of 15 years, the company has grown from a small eatery at a bus stop into a modern, extensive network, which today includes more than 65 restaurants throughout Uzbekistan, its own fastest delivery service, a modern IT infrastructure and more than 3,000 employees.\nYou can learn more about us on our web-site🌐`,
      reply_markup: webSiteKey,
    }
  );
});

// Here is the piece of which is responsible for "Support⚙️" button
bot.hears(initialKeyCommands.SUPPORT, async (ctx) => {
  ctx.reply(
    "If you have errors, questions or ideas, you can contact to @e_raxmonov"
  );
});

// And finally the last piece of code which is responsible for "generating inline keys" and "callback queries"

const generateInlineKeyboard = (category) => {
  const productsByCategory = products[category];
  const inlineKeyboard = new InlineKeyboard();

  productsByCategory.forEach((prod, index) => {
    inlineKeyboard.text(prod.name, `${category}-${prod.id}`);
    if ((index + 1) % 1 === 0) {
      inlineKeyboard.row();
    }
  });

  const callBackQueryTriggers = productsByCategory.map(
    (prod) => `${category}-${prod.id}`
  );

  return {
    inlineKeyboard,
    callBackQueryTriggers,
  };
};

let trigger;
bot.hears(Object.values(categoriesKeyCommands), async (ctx) => {
  const command = ctx.message.text;
  if (command === categoriesKeyCommands.BACK) {
    return ctx.reply("Going back", {
      reply_markup: initialKey,
    });
  }

  const productList = products[command];

  const productListWithPrices = productList
    .map((item, index) => `${index + 1}. ${item.name} - ${item.cost} UZS`)
    .join("\n");

  const { callBackQueryTriggers, inlineKeyboard } =
    generateInlineKeyboard(command);
  trigger = callBackQueryTriggers;

  ctx.reply(productListWithPrices, {
    reply_markup: inlineKeyboard,
  });
});

bot.callbackQuery(trigger, (ctx) => {
  const data = ctx.callbackQuery.data.split("-");
  const category = data[0];
  const id = data[1];
  const productsByCategory = products[category];
  const product = productsByCategory.find((prod) => prod.id === Number(id));

  if (!ctx.session.products[category]) {
    ctx.session.products[category] = {};
  }

  if (ctx.session.products[category][id]) {
    ctx.session.products[category][id].quantity += 1;
  } else {
    ctx.session.products[category][id] = { ...product, quantity: 1 };
  }

  ctx.answerCallbackQuery(`One "${product.name}" added to your basket`);
});

bot.start();
