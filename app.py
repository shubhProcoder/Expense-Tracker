from flask import Flask, request, jsonify  
from flask_cors import CORS               
import sqlite3                             

app = Flask(__name__)
CORS(app)  

DATABASE = "database.db"


def get_db():
    """Opens a connection to the SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  
    return conn


def init_db():
    """Creates the 'expenses' table when the app starts."""
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            amount   INTEGER NOT NULL,
            category TEXT    NOT NULL
        )
    """)
    conn.commit()
    conn.close()


@app.route("/expenses", methods=["GET"])
def get_expenses():
    conn = get_db()
    rows = conn.execute("SELECT * FROM expenses ORDER BY id DESC").fetchall()
    conn.close()

    expenses = [{"id": row["id"], "amount": row["amount"], "category": row["category"]} for row in rows]
    return jsonify(expenses)  


@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.get_json()  

    amount   = data.get("amount")
    category = data.get("category")

    if not amount or not category:
        return jsonify({"error": "Amount and category are required"}), 400

    conn = get_db()
    conn.execute("INSERT INTO expenses (amount, category) VALUES (?, ?)", (amount, category))
    conn.commit()
    conn.close()

    return jsonify({"message": "Expense added successfully"}), 201

@app.route("/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    conn = get_db()
    conn.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Expense deleted successfully"})


if __name__ == "__main__":
    init_db()               
    app.run(debug=True)