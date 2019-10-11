// BUDGET CONTROLLER
var budgetController = (function()
{
    
    var Expense = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function (id, description, value) 
    {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = 
    {
        items: 
        {
            expenses: [],
            income: []
        },
        
        totals: 
        {
            expenses: 0,
            income: 0
        }
    };


    return {
        itemAdd: function(type, description, value) 
        {
            var itemNew, id;

            // Create new id
            if(data.items[type].length > 0)
                id = data.items[type][data.items[type].length - 1].id + 1;
            else
                id = 0;

            // Create new item based on the type
            if(type == 'expenses')
                itemNew = new Expense(id, description, value)
            
            else if (type == 'income')
                itemNew = new Income(id, description, value)
            
            // Push the new item to data.items
            data.items[type].push(itemNew);
            return itemNew;
            
        },
    }


})();

// UI CONTROLLER
var UIController = (function() 
{

    var DOMstrings = 
    {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    
    return {
        getInput: function() 
        {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function()
        {
            return DOMstrings;
        }
    }

})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) 
{

    var setupEventListeners = function() 
    {

        var DOMstrings = UICtrl.getDOMstrings();

        document.querySelector(DOMstrings.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) 
        {
            if (event.keyCode == 13 || event.which == 13) 
            ctrlAddItem();
            
        })
    }

    var ctrlAddItem = function()
    {
        var input, itemNew;

        input = UICtrl.getInput();

        itemNew = budgetCtrl.itemAdd(input.type, input.description, input.value);

    };
    
    return {
        init: function()
        {
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();