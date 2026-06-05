import React, { useState, useEffect } from "react";
import { Input, Button, Space } from "antd";
import { InfoCircleOutlined, ClearOutlined } from "@ant-design/icons";
import "../style.css";

const { TextArea } = Input;

export const SmartTextArea = ({
  value,
  onChange,
  name,
  placeholder,
  helpText,
  minItems = 0,
  maxItems = 50,
  required = false,
  disabled = false,
}) => {
  const [itemCount, setItemCount] = useState(0);
  const [isNumbered, setIsNumbered] = useState(false);

  useEffect(() => {
    if (value) {
      const lines = value.split("\n").filter((line) => line.trim() !== "");
      setItemCount(lines.length);
      
      // Detectar si el texto ya está numerado
      const hasNumbering = lines.some(line => /^\d+\.\s/.test(line));
      setIsNumbered(hasNumbering);
    } else {
      setItemCount(0);
      setIsNumbered(false);
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      const lines = e.target.value.split("\n");
      const lastLine = lines[lines.length - 1];
      
      // Detectar si la última línea tiene numeración
      const match = lastLine.match(/^(\d+)\.\s(.*)$/);
      if (match) {
        const lineContent = match[2].trim();
        
        // Si la línea actual está vacía (solo tiene el número), no agregar nueva línea numerada
        if (lineContent === "") {
          e.preventDefault();
          // Remover la línea vacía numerada
          const cursorPos = e.target.selectionStart;
          const lineStart = e.target.value.lastIndexOf("\n", cursorPos - 1) + 1;
          const newValue = 
            e.target.value.slice(0, lineStart) + 
            e.target.value.slice(cursorPos);
          onChange({ target: { name, value: newValue } });
          return;
        }
        
        const nextNum = parseInt(match[1]) + 1;
        // Prevenir el comportamiento default del Enter
        e.preventDefault();
        
        // Insertar siguiente número
        const cursorPos = e.target.selectionStart;
        const newValue = 
          e.target.value.slice(0, cursorPos) + 
          "\n" + 
          `${nextNum}. ` + 
          e.target.value.slice(cursorPos);
        
        onChange({ target: { name, value: newValue } });
        
        // Mover cursor después del número
        setTimeout(() => {
          const newCursorPos = cursorPos + nextNum.toString().length + 3;
          e.target.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }
    }
  };

  const handleToggleNumbering = () => {
    if (!value) return;
    
    const lines = value.split("\n");
    
    if (isNumbered) {
      // Limpiar numeración
      const cleanedLines = lines.map((line) => {
        return line.replace(/^\d+\.\s/, "").trim();
      }).filter(line => line !== "");
      
      onChange({ target: { name, value: cleanedLines.join("\n") } });
    } else {
      // Agregar numeración
      const cleanedLines = lines.map((line) => {
        return line.replace(/^\d+\.\s/, "").trim();
      });
      
      const numberedLines = cleanedLines
        .filter((line) => line !== "")
        .map((line, index) => `${index + 1}. ${line}`);
      
      onChange({ target: { name, value: numberedLines.join("\n") } });
    }
  };

  const getItemCountColor = () => {
    if (itemCount < minItems) return "var(--danger)";
    if (itemCount > maxItems) return "var(--danger)";
    return "var(--success)";
  };

  const getItemCountText = () => {
    if (minItems > 0 && itemCount < minItems) return `${itemCount} ítems (mínimo ${minItems})`;
    if (itemCount > maxItems) return `${itemCount} ítems (máximo ${maxItems})`;
    return `${itemCount} ítems`;
  };

  return (
    <div className="smart-textarea-container">
      <TextArea
        value={value || ""}
        onChange={(e) => onChange({ target: { name, value: e.target.value } })}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
        className={required && !value ? "input-error" : ""}
        style={{
          resize: "vertical",
          minHeight: "150px",
        }}
      />
      
      <div className="smart-textarea-footer">
        <div className="smart-textarea-help">
          <InfoCircleOutlined />
          <span>{helpText}</span>
        </div>
        
        <Space>
          <span 
            className="smart-textarea-counter"
            style={{ color: getItemCountColor() }}
          >
            {getItemCountText()}
          </span>
          
          {value && (
            <Button
              type="text"
              size="small"
              icon={<ClearOutlined />}
              onClick={handleToggleNumbering}
              className="smart-textarea-clear-btn"
              title={isNumbered ? "Quitar numeración" : "Numerar líneas"}
            >
              {isNumbered ? "Limpiar números" : "Numerar"}
            </Button>
          )}
        </Space>
      </div>
    </div>
  );
};
