// BUDGET CONTROLLER
var budgetController = (function()
{
    // Code
})();

// UI CONTROLLER
var UIController = (function() 
{
    // Code
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) 
{

    var ctrlAddItem = function()
    {
        console.log('Enter!')
    }
    
    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) 
    {
        if(event.keyCode == 13 || event.which == 13)
        {
            ctrlAddItem();
        }
    })
})(budgetController, UIController);