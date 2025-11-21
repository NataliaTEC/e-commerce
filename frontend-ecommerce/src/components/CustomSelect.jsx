import React, { useEffect, useRef, useState } from "react";
import "../views/paymentMethods.css";

export default function CustomSelect({ options = [], value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value);
      setHighlight(idx >= 0 ? idx : 0);
    } else {
      setHighlight(-1);
    }
  }, [open, value, options]);

  function toggle() {
    setOpen((v) => !v);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (h < options.length - 1 ? h + 1 : h));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => (h > 0 ? h - 1 : 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open && highlight >= 0) {
        onChange(options[highlight].value);
        setOpen(false);
      } else {
        setOpen(true);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={`custom-select ${className}`} ref={ref}>
      <button
        type="button"
        className="cs-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className="cs-label">{selected ? selected.label : "Selecciona..."}</span>
        <span className="cs-caret">▾</span>
      </button>

      {open && (
        <ul role="listbox" tabIndex={-1} className="cs-list" onKeyDown={onKeyDown}>
          {options.map((opt, idx) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`cs-option ${idx === highlight ? "highlight" : ""} ${opt.value === value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              onMouseEnter={() => setHighlight(idx)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
