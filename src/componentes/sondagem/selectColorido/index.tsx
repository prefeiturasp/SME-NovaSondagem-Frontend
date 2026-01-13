import { Empty, Select as SelectAnt } from "antd";
import type { SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { nanoid } from "nanoid";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import "./index.css";

interface SelectColoridoProps extends SelectProps {
  onOpenChange?: (open: boolean) => void;
}

const SelectColorido = forwardRef<any, SelectColoridoProps>(
  ({ value, onChange, onOpenChange, onKeyDown, ...props }, ref) => {
    const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
    const [textColor, setTextColor] = useState<string>("#000000");
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<any>(null);
    const uniqueId = useMemo(
      () => props.id ?? `select-${nanoid(9)}`,
      [props.id]
    );

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (selectRef.current) {
          selectRef.current.focus();
        }
      },
      blur: () => {
        if (selectRef.current) {
          selectRef.current.blur();
        }
      },
    }));

    const filterOption = (input: string, option?: DefaultOptionType) => {
      const optionValue = option?.value?.toString()?.toLowerCase();
      const label = option?.label;
      const description = (
        typeof label === "string" ? label : ""
      ).toLowerCase();

      const hasValue =
        !!optionValue && optionValue?.indexOf(input?.toLowerCase()) >= 0;
      const hasDesc =
        !!description &&
        description?.toLowerCase().indexOf(input?.toLowerCase()) >= 0;

      return hasValue || hasDesc;
    };

    const getColorByValue = useCallback(
      (selectedValue: any): { bg: string; text: string } => {
        if (!selectedValue || !props.options)
          return { bg: "#FFFFFF", text: "#000000" };

        const selectedOption = props.options.find(
          (opt: any) => opt.value === selectedValue
        );

        if (selectedOption?.corFundo && selectedOption?.corTexto) {
          return {
            bg: selectedOption.corFundo,
            text: selectedOption.corTexto,
          };
        }

        return { bg: "#FFFFFF", text: "#000000" };
      },
      [props.options]
    );

    const handleChange = (newValue: any, option: any) => {
      if (newValue === null || newValue === undefined) {
        setBackgroundColor("#FFFFFF");
        setTextColor("#000000");
      } else {
        const colors = getColorByValue(newValue);
        setBackgroundColor(colors.bg);
        setTextColor(colors.text);
      }
      if (onChange) {
        onChange(newValue, option);
      }
    };

    const handleOpenChange = (open: boolean) => {
      setIsOpen(open);
      if (onOpenChange) {
        onOpenChange(open);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isOpen && /^\d$/.test(e.key)) {
        e.preventDefault();
        const numero = Number.parseInt(e.key);
        const opcaoEncontrada = props.options?.find(
          (opt: any) => opt.ordem === numero
        );
        if (opcaoEncontrada && onChange) {
          onChange(opcaoEncontrada.value, opcaoEncontrada);
          setIsOpen(false);
          if (onOpenChange) {
            onOpenChange(false);
          }
        }
        return;
      }

      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !isOpen) {
        e.stopPropagation();
      }

      if (onKeyDown) {
        onKeyDown(e as any);
      }
    };

    useEffect(() => {
      if (value) {
        const colors = getColorByValue(value);
        setBackgroundColor(colors.bg);
        setTextColor(colors.text);
      }
    }, [value, getColorByValue, props.id]);

    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
        .ant-select.select-colorido-${uniqueId} .ant-select-selector {
          background-color: ${backgroundColor} !important;
          border-color: ${backgroundColor} !important;
        }
        .ant-select.select-colorido-${uniqueId} .ant-select-selection-item,
        .ant-select.select-colorido-${uniqueId} .ant-select-selection-placeholder {
          color: ${textColor} !important;
          font-weight: 500 !important;
        }
        .ant-select.select-colorido-${uniqueId} .ant-select-selection-search-input {
          color: ${textColor} !important;
        }
        .ant-select.select-colorido-${uniqueId} .ant-select-arrow {
          color: ${textColor} !important;
        }        
        .ant-select.select-colorido-${uniqueId} .ant-select-clear {
          top: 45% !important;
          width: 20px !important;
          inset-inline-end: 8px !important;
          background: ${backgroundColor} !important;
          color: ${textColor} !important;
          border-radius: 4px !important;
          opacity: 1 !important;
        }
        .ant-select.select-colorido-${uniqueId} .ant-select-clear:hover {
          opacity: 0.8 !important;
        }
        .ant-select.select-colorido-${uniqueId} .ant-select-clear .anticon {
          color: inherit !important;
        }
        .ant-select.select-colorido-${uniqueId}.ant-select-disabled .ant-select-selector {
          opacity: 0.6 !important;
          background-color: ${backgroundColor} !important;
        }
      `,
          }}
        />
        <SelectAnt
          ref={selectRef}
          notFoundContent={
            <Empty
              description="Sem dados"
              className="ant-empty-small"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          }
          showSearch
          allowClear
          filterOption={filterOption}
          {...props}
          value={value}
          onChange={handleChange}
          onOpenChange={handleOpenChange}
          onKeyDown={handleKeyDown}
          className={`select-colorido select-colorido-${uniqueId} ${
            props.className ?? ""
          }`}
        />
      </>
    );
  }
);

SelectColorido.displayName = "SelectColorido";

export default SelectColorido;
