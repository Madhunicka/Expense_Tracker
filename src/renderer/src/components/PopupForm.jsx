import React from 'react'

export const PopupForm = () => {

    const handlePopup = ()=>{
        console.log('clicked')
        //open a small popup window
        window.electron.ipcRenderer.send('open-popup')
        
    }
  return (
    <div>
    <button onClick={handlePopup} className="absolute right-10 rounded-xl bg-blue-400 px-10 py-1 text-lg mt-1 ml-1">+ New</button>
  </div>
  )
}
