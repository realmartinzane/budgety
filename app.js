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

    var totalCalculate = function(type)
    {
        var sum = 0;

        data.items[type].forEach(function(cur)
        {
            sum += cur.value;
        });
        data.totals[type] = sum;
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
        },
        
        budget: 0,
        percentage: -1
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

        itemDelete: function(type, id)
        {
            var ids, index;
            
           ids = data.items[type].map(function(cur)
            {
                return cur.id
            });

            index = ids.indexOf(id);

            if(index !== -1)
            {
                data.items[type].splice(index, 1);
            }
        },

        budgetCalculate: function()
        {
            totalCalculate('income');   
            totalCalculate('expenses');

            data.budget = data.totals.income - data.totals.expenses;

            if(data.totals.income > 0)
                data.percentage = Math.round((data.totals.expenses / data.totals.income) * 100);
            else 
                data.percentage = -1;
        },

        getBudget: function()
        {
            return {
                budget: data.budget,
                incomeTotal: data.totals.income,
                еxpensesTotal: data.totals.expenses,
                percentage: data.percentage
            }
        }
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    
    return {
        getInput: function() 
        {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        getDOMstrings: function()
        {
            return DOMstrings;
        },

        listItemAdd: function(item, type)
        {
            var html, htmlNew, element;

            if(type == 'income')
            {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type == 'expenses')
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expenses-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div> </div>'
            }
            htmlNew = html.replace('%id%', item.id);
            htmlNew = htmlNew.replace('%description%', item.description);
            htmlNew = htmlNew.replace('%value%', item.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', htmlNew);
        },

        listItemDelete: function(id)
        {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        clearFields: function()
        {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(cur, idx, arr)
            {
                cur.value = '';
            });

            fieldsArray[0].focus();
        },

        budgetDisplay: function (data) 
        {
            document.querySelector(DOMstrings.budgetLabel).textContent = data.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = '+ '+ data.incomeTotal;
            document.querySelector(DOMstrings.expensesLabel).textContent = '- ' + data.еxpensesTotal;
            

            if(data.percentage > 0)
                document.querySelector(DOMstrings.percentageLabel).textContent = data.percentage + '%';
            else 
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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

        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);
    }

    var updateBudget = function()
    {
        budgetCtrl.budgetCalculate();

        var budget = budgetCtrl.getBudget();

        UICtrl.budgetDisplay(budget);
    }

    var ctrlAddItem = function()
    {
        var input, itemNew;

        input = UICtrl.getInput();

        if(input.description !== '' && !isNaN(input.value) && input.value > 0)
        {
            itemNew = budgetCtrl.itemAdd(input.type, input.description, input.value);

            UICtrl.listItemAdd(itemNew, input.type);

            UICtrl.clearFields();

            updateBudget();
        }

    };

    var ctrlDeleteItem = function(event)
    {
        var itemID, splitID, type, id;

        itemID  = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID)
        {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            
            budgetCtrl.itemDelete(type, id);

            UICtrl.listItemDelete(itemID);

            updateBudget();
        }

        
    }
    
    return {
        init: function()
        {
            UICtrl.budgetDisplay(
                {
                    budget: 0,
                    incomeTotal: 0,
                    еxpensesTotal: 0,
                    percentage: -1
                }
            );
            setupEventListeners();
        }
    }
    
})(budgetController, UIController);

controller.init();