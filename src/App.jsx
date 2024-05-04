import { Fragment, useEffect, useRef, useState } from "react"
import "./App.css"
import "./select.css"
import { options } from "./assets/options"
import { CustomSelect } from "./components/CustomSelect"

function App() {
  return (
    <Fragment>
      <div className="container">
        {/* ORDINARY SELECT CONTAINER */}
        <div className="select-container hidden">
          <label>State</label>
          <select data-ordinary>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* CUSTOM SELECT CONTAINER */}
        <div className="select-container">
          <CustomSelect options={options} placeholder="Choose a state" />
        </div>
      </div>
    </Fragment>
  )
}

export default App
