import { createRef, Fragment, useEffect, useRef, useState } from "react"
import _ from "lodash"

export const CustomSelect = ({ options, placeholder = "" }) => {
  const optionsLength = options.length
  const optionRefs = createRef([])
  optionRefs.current = []

  const selectOptionsRef = useRef()

  useEffect(() => {}, [])
  const [formattedOptions, setFormattedOptions] = useState(
    options.map((opt, index) => ({
      value: opt.value,
      label: opt.label,
      selected: opt.selected,
      element: opt,
      index: index,
    }))
  )

  function currentSelectedOptionLabel() {
    const foundOption = formattedOptions.find((opt) => opt.selected)
    return foundOption !== undefined ? foundOption.label : placeholder
  }

  const [selectedOption, setSelectedOption] = useState(
    currentSelectedOptionLabel()
  )
  const [expanded, setExpanded] = useState(false)

  function open() {
    setExpanded(true)
  }

  function close() {
    setExpanded(false)
  }

  function select(option) {
    const newFormattedOptions = formattedOptions.map((opt) =>
      opt === option ? { ...opt, selected: true } : { ...opt, selected: false }
    )

    setFormattedOptions(newFormattedOptions)
    setSelectedOption(option.label)
    close()
  }

  function toggleExpanded() {
    setExpanded((prev) => !prev)
  }

  function getSelectedOptionIndex() {
    const foundOption = formattedOptions.find((opt) => opt.selected)
    return foundOption !== undefined ? foundOption.index : -1
  }

  function handleKeyDown(evnt) {
    let selectedIndex = getSelectedOptionIndex()
    switch (evnt.code) {
      case "Enter":
        toggleExpanded()
        if (selectedIndex > 0) {
          optionRefs.current[selectedIndex].scrollIntoView()
        }

        break

      case "ArrowUp":
        selectedIndex - 1 < 0 ? (selectedIndex = 0) : (selectedIndex -= 1)

        const prevOption = formattedOptions[selectedIndex]
        select(prevOption)
        toggleExpanded()
        ensureInView(
          selectOptionsRef.current,
          optionRefs.current[selectedIndex]
        )
        break

      case "ArrowDown":
        selectedIndex + 1 >= optionsLength
          ? (selectedIndex = optionsLength - 1)
          : (selectedIndex += 1)

        const nextOption = formattedOptions[selectedIndex]
        select(nextOption)
        toggleExpanded()
        ensureInView(
          selectOptionsRef.current,
          optionRefs.current[selectedIndex]
        )
        break

      case "Space":
        open()
        break

      case "Escape":
        close()
        break

      default:
        break
    }
  }

  const addToRefs = (el) => {
    if (el && !optionRefs.current.includes(el)) {
      optionRefs.current.push(el)
    }
  }

  function ensureInView(container, element) {
    //Determine container top and bottom
    let cTop = container.scrollTop
    let cBottom = cTop + container.clientHeight

    //Determine element top and bottom
    let eTop = element.offsetTop
    let eBottom = eTop + element.clientHeight

    //Check if out of view
    if (eTop < cTop) {
      container.scrollTop -= cTop - eTop
    } else if (eBottom > cBottom) {
      container.scrollTop += eBottom - cBottom
    }
  }

  return (
    <Fragment>
      {/* WRAPPER AROUND THE CUSTOM SELECT */}
      <div
        className={`custom-select-container`}
        tabIndex={"0"}
        onBlur={close}
        onKeyDown={handleKeyDown}
      >
        {/* LABEL ELEMENT */}
        {/* <select data-custom></select> */}
        <span className="custom-select-value" onClick={toggleExpanded}>
          {selectedOption}
        </span>
        {/* ALL THE OPTIONS */}
        {/* {expanded && ( )} */}
        <ul
          ref={selectOptionsRef}
          className={`custom-select-options ${expanded ? "show" : ""}`}
        >
          {formattedOptions.map((opt) => (
            <li
              key={opt.value}
              ref={addToRefs}
              value={opt.value}
              className={`custom-select-option ${
                opt.selected ? "selected" : ""
              }`}
              onClick={() => select(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  )
}
