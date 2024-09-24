import { useState } from "react";
import React from 'react';

export default function FormField() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(''); // New state for the date

  const handleSubmit = async (e) => {
    e.preventDefault();

    const expenseData = {
      description,
      amount: parseFloat(amount),
      category,
      date,
    };

    // Send the expense data to the main process
    await window.api.addExpense(expenseData);

    // Clear the form fields
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-10 pt-6 pb-8 mb-4 max-w-sm mx-auto mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amount
        </label>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category
        </label>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-14 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
