import React, { useEffect, useState } from 'react';

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const fetchedExpenses = await window.api.getExpenses();
    console.log('Fetched Expenses:', fetchedExpenses); // Log fetched data
    setExpenses(fetchedExpenses);
  };

  useEffect(() => {
    fetchExpenses();

    const handleExpensesUpdated = (event, updatedExpenses) => {
      console.log('Updated Expenses:', updatedExpenses); // Log updated data
      setExpenses(updatedExpenses);
    };

    // Listen for the expenses-updated event
    window.api.on('expenses-updated', handleExpensesUpdated);

    // Cleanup listeners on unmount
    return () => {
      window.api.off('expenses-updated', handleExpensesUpdated);
    };
  }, []);

  return (
    <table className="table-auto w-full border-collapse mt-20">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">Description</th>
          <th className="border px-4 py-2">Amount</th>
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Date</th>
          
        </tr>
      </thead>
      <tbody>
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{expense.description}</td>
              <td className="border px-4 py-2">{expense.amount}</td>
              <td className="border px-4 py-2">{expense.category}</td>
              <td className="border px-4 py-2">{expense.date}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center py-4">
              No expenses recorded.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ExpenseTable;
