import { Empty, Select as SelectAnt } from "antd";
import type { SelectProps } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { nanoid } from "nanoid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./index.css";

interface SelectColoridoProps extends SelectProps {
  tipoQuestao?:
    | "escrita"
    | "reescrita"
    | "producao"
    | "leitura"
    | "numeros"
    | "mapeamento";
  anoTurma?: string;
}

const SelectColorido: React.FC<SelectColoridoProps> = ({
  tipoQuestao,
  anoTurma,
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

      let cores: string[] = [
        "#FF3131",
        "#FFDE59",
        "#FF914D",
        "#5170FF",
        "#00BF63",
        "#FFFFFF",
      ];
      let textColors: string[] = [
        "#FFFFFF",
        "#42474A",
        "#FFFFFF",
        "#FFFFFF",
        "#FFFFFF",
        "#42474A",
      ];
      switch (tipoQuestao) {
        case "escrita":
          switch (anoTurma) {
            case "1":
              cores = [
                "#FF3131",
                "#FFDE59",
                "#FF914D",
                "#5170FF",
                "#00BF63",
                "#FFFFFF",
              ];
              textColors = [
                "#FFFFFF",
                "#42474A",
                "#FFFFFF",
                "#FFFFFF",
                "#FFFFFF",
                "#42474A",
              ];
              break;
            case "2":
            case "3":
              cores = [
                "#FF3131",
                "#FFDE59",
                "#FF914D",
                "#D9D2E9",
                "#D0C2EF",
                "#C3B0EB",
                "#AF92ED",
              ];
              textColors = [
                "#FFFFFF",
                "#42474A",
                "#FFFFFF",
                "#42474A",
                "#42474A",
                "#42474A",
                "#FFFFFF",
              ];
              break;
            default:
              cores = ["#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575"];
              textColors = ["#42474A", "#42474A", "#FFFFFF", "#FFFFFF"];
          }
          break;
        case "leitura":
          cores = ["#7ED957", "#FFDE59", "#F18888"];
          textColors = ["#363636", "#363636", "#FFFFFF"];
          break;
        case "numeros":
          cores = ["#D9EEFA", "#BBE0F6", "#8ED5FF", "#38B6FF"];
          textColors = ["#42474A", "#42474A", "#42474A", "#42474A"];
          break;
        case "mapeamento":
          cores = ["#7ED957", "#FFDE59", "#F18888"];
          textColors = ["#42474A", "#42474A", "#42474A"];
          break;
      }

      const index = props.options.findIndex(
        (opt: any) => opt.value === selectedValue
      );
      return index >= 0
        ? {
            bg: cores[index % cores.length],
            text: textColors[index % textColors.length],
          }
        : { bg: "#FFFFFF", text: "#000000" };
    },
    [props.options, tipoQuestao, anoTurma]
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
  }, [value, getColorByValue, tipoQuestao, anoTurma, props.id]);

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
