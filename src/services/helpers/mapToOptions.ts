export function mapIdNameAndSort(data: any[], labelKey: string = "nome") {
  if (!Array.isArray(data)) return [];
  return data
    .map((item: any) => ({ value: item.id, label: item[labelKey] }))
    .sort((a: any, b: any) =>
      String(a.label).localeCompare(String(b.label), "pt-BR", {
        sensitivity: "base",
      }),
    );
}
