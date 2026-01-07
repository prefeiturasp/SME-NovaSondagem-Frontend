import { Empty, Select as SelectAnt } from "antd";
import type { SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";

interface SelectColoridoProps extends SelectProps {}

const SelectColorido: React.FC<SelectColoridoProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [textColor, setTextColor] = useState<string>("#000000");
  const uniqueId = useMemo(() => props.id ?? `select-${nanoid(9)}`, [props.id]);

  const filterOption = (input: string, option?: DefaultOptionType) => {
    const optionValue = option?.value?.toString()?.toLowerCase();
    const label = option?.label;
    const description = (typeof label === "string" ? label : "").toLowerCase();

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

      if (
        selectedOption &&
        selectedOption.corFundo &&
        selectedOption.corTexto
      ) {
        return {
          bg: selectedOption.corFundo,
          text: selectedOption.corTexto,
        };
      }

      // Fallback caso não encontre as cores
      return { bg: "#FFFFFF", text: "#000000" };
    },
    [props.options]
  );

  const handleChange = (newValue: any, option: any) => {
    const colors = getColorByValue(newValue);
    setBackgroundColor(colors.bg);
    setTextColor(colors.text);
    if (onChange) {
      onChange(newValue, option);
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
        /* Ant Design v5 - Estrutura atualizada */
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
        .ant-select.select-colorido-${uniqueId} .ant-select-arrow,
        .ant-select.select-colorido-${uniqueId} .anticon {
          color: ${textColor} !important;
        }
        .ant-select.select-colorido-${uniqueId}.ant-select-disabled .ant-select-selector {
          opacity: 0.6 !important;
          background-color: ${backgroundColor} !important;
        }
      `,
        }}
      />
      <SelectAnt
        notFoundContent={
          <Empty
            description="Sem dados"
            className="ant-empty-small"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        }
        showSearch
        filterOption={filterOption}
        getPopupContainer={(trigger) => trigger.parentElement}
        value={value}
        onChange={handleChange}
        {...props}
        className={`select-colorido select-colorido-${uniqueId} ${
          props.className ?? ""
        }`}
      />
    </>
  );
};

export default SelectColorido;
