import React from "react"
import { PopupForm } from "./components/PopupForm"
import ExpenseTable from "./components/ExpenseTable"


function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <div className="p-6">
      <div>
      <h1 className="text-4xl font-bold mb-4 flex justify-center">Expense Tracker</h1>

      </div>

      {/* <div>
        <button className="absolute right-10 rounded-xl bg-blue-400 px-10 py-1 text-lg mt-1 ml-1">+ New</button>
      </div> */}

     <PopupForm/>

     <ExpenseTable/>
      
    </div>
   
  )
}

export default App

