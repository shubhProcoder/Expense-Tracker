const API_URL = "http://127.0.0.1:5000/expenses";


function loadExpenses() {
  
  fetch(API_URL)
    .then(function(response) {
      return response.json();  
    })
    .then(function(expenses) {
      displayExpenses(expenses); 
    })
    .catch(function(error) {
      console.error("Error loading expenses:", error);
    });
}


function displayExpenses(expenses) {
  var list = document.getElementById("expenseList");

  if (expenses.length === 0) {
    list.innerHTML = '<p class="empty-msg">No expenses yet. Add one above!</p>';
    return;
  }

  var html = "";
  for (var i = 0; i < expenses.length; i++) {
    var exp = expenses[i];
    html += '<div class="expense-item">';
    html +=   '<div class="expense-info">';
    html +=     '<span class="expense-amount">₹' + exp.amount + '</span>';
    html +=     '<span class="expense-category">' + exp.category + '</span>';
    html +=   '</div>';
    html +=   '<button class="delete-btn" onclick="deleteExpense(' + exp.id + ')">Delete</button>';
    html += '</div>';
  }

  list.innerHTML = html;  
}

function addExpense() {
  var amount   = document.getElementById("amount").value.trim();
  var category = document.getElementById("category").value.trim();

  if (!amount || !category) {
    alert("Please fill in both Amount and Category.");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"  
    },
    body: JSON.stringify({ amount: amount, category: category })  
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      document.getElementById("amount").value   = "";
      document.getElementById("category").value = "";

      loadExpenses();
    })
    .catch(function(error) {
      console.error("Error adding expense:", error);
    });
}


function deleteExpense(id) {
  fetch(API_URL + "/" + id, {
    method: "DELETE"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      loadExpenses();  
    })
    .catch(function(error) {
      console.error("Error deleting expense:", error);
    });
}

loadExpenses();