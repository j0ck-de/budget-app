"use strict";

// ─── DATA CONTROLLER ────────────────────────────────────────────────────────────
const DataController = (() => {
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const data = {
    allItems: {
      expense: [],
      income: []
    },
    totals: {
      expense: 0,
      income: 0
    }
  };

  return {
    addItem: (type, desc, val) => {
      let newItem, id;

      // create new ID
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // create new item based on inc or exp type
      newItem =
        type === "expense"
          ? new Expense(id, desc, val)
          : new Income(id, desc, val);

      // push it into our data structure
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },

    calculateBudget: () => {},

    testing: () => console.log(data)
  };
})();
// ────────────────────────────────────────────────────────── DATA CONTROLLER ─────

// ─── UI CONTROLLER ──────────────────────────────────────────────────────────────
const UIController = (() => {
  const domStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(domStrings.inputType).value, // This will be either inc or exp
        description: document.querySelector(domStrings.inputDescription).value,
        value: parseFloat(document.querySelector(domStrings.inputValue).value)
      };
    },

    addListItem: (obj, type) => {
      let html, newHtml, element;

      // create HTML string with placeholder text
      if (type === "income") {
        element = domStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "expense") {
        element = domStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace the placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    getDomStrings: () => domStrings,

    clearFields: () => {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        domStrings.inputDescription + ", " + domStrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach((current, index, array) => {
        current.value = "";
      });

      fieldsArr[0].focus();
    }
  };
})();
// ──────────────────────────────────────────────────────────── UI CONTROLLER ─────

// ─── APP CONTROLLER ─────────────────────────────────────────────────────────────
const AppController = ((dataCtrl, uiCtrl) => {
  const setupEventListeners = () => {
    const domStrings = UIController.getDomStrings();

    // Listens the add button for a click
    document
      .querySelector(domStrings.inputButton)
      .addEventListener("click", appCtrlAddItem);

    // Keypress event listener happens anywhere in the document, not by clicking a specific element.
    document.addEventListener("keypress", event => {
      if (event.keyCode === 13 || event.which === 13) {
        appCtrlAddItem();
      }
    });
  };

  const updateBudget = () => {
    // 1. Calculate the budget
    // 2. Return the budget
    // 3. Display the budget on the UI
  };

  const appCtrlAddItem = () => {
    // 1. Get the field input data
    const input = UIController.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      const newItem = DataController.addItem(
        input.type,
        input.description,
        input.value
      );

      // 3. Add the item to the UI
      UIController.addListItem(newItem, input.type);

      // 4. Clear the fields
      UIController.clearFields();

      // 5. Calculate and update budget
      updateBudget();
    }
  };

  return {
    init: () => {
      console.log("Application has started...");
      setupEventListeners();
    }
  };
})(DataController, UIController);
// ─────────────────────────────────────────────────────────── APP CONTROLLER ─────

AppController.init();
