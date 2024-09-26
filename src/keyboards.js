import { Keyboard } from "grammy";

export const initialKeyCommands = {
  ORDER: "Order📝",
  BASKET: "Basket🛒",
  ORDERHISTORY: "Order History📖",
  MOBILEAPPS: "Mobile apps📱",
  ABOUT: "About usℹ️",
  SUPPORT: "Support⚙️",
};

export const initialKey = new Keyboard()
  .add(initialKeyCommands.ORDER)
  .row()
  .add(initialKeyCommands.BASKET)
  .row()
  .add(initialKeyCommands.ORDERHISTORY)
  .add(initialKeyCommands.ABOUT)
  .row()
  .add(initialKeyCommands.SUPPORT)
  .add(initialKeyCommands.MOBILEAPPS)
  .resized();

export const categoriesKeyCommands = {
  LAVASHES: "Lavashes🌯",
  BURGERS: "Burgers🍔",
  SHAURMA: "Shaurmas🥙",
  DONARS: "Donars🥙",
  HOTDOG: "Hot-dogs🌭",
  FRIES: "French Fries🍟",
  DESERTS: "Deserts🧁",
  SOUSES: "Souses🥫",
  HOTDRINKS: "Hot Drinks☕",
  COLDDRINKS: "Cold Drinks🥤",
  COMBOS: "EVOS Combos🍱",
  BACK: "Back to menu⬅️",
};

export const categoriesKey = new Keyboard()
  .add({ text: categoriesKeyCommands.LAVASHES })
  .add({ text: categoriesKeyCommands.BURGERS })
  .row()
  .add({ text: categoriesKeyCommands.SHAURMA })
  .add({ text: categoriesKeyCommands.DONARS })
  .row()
  .add({ text: categoriesKeyCommands.HOTDOG })
  .add({ text: categoriesKeyCommands.FRIES })
  .row()
  .add({ text: categoriesKeyCommands.DESERTS })
  .add({ text: categoriesKeyCommands.SOUSES })
  .row()
  .add({ text: categoriesKeyCommands.HOTDRINKS })
  .add({ text: categoriesKeyCommands.COLDDRINKS })
  .row()
  .add({ text: categoriesKeyCommands.BACK })
  .resized();
