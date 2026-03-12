import {
  Input,
  Button,
  Tooltip,
  ConfigProvider,
  Checkbox,
  Dropdown,
} from "antd";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { ICompanyFilter } from "@/interfaces/consult";
import { Control, Controller, UseFormHandleSubmit } from "react-hook-form";
import { InputNumber } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";

import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import { customLocale } from "@/utils/customLocale";
import { handleExportXLSX } from "../controllers/exportXLSX";

interface FiltroPedidosFormProps {
  control: Control<ICompanyFilter>;
  handleSubmit: UseFormHandleSubmit<ICompanyFilter>;
  onSubmit: (data: ICompanyFilter) => void;
  onClear: () => void;
  selectedRowKeys: any;
  isFiltered: boolean;

  allColumnOptions: any[];
  visibleColumns: string[];
  handleColumnsChange: (checked: string[]) => void;
  tableColumns: any;
}

const CPFInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="###.###.###-##"
    customInput={Input}
    placeholder="CPF"
    size="middle"
    allowEmptyFormatting
  />
);
export function FilterClients({
  control,
  handleSubmit,
  onSubmit,
  onClear,
  selectedRowKeys,

  visibleColumns,
  tableColumns,
  handleColumnsChange,
  allColumnOptions,
}: FiltroPedidosFormProps) {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex justify-between items-center  min-w-[200px] flex-wrap  gap-2 mb-4"
    >
      <div className="flex gap-2 items-center flex-wrap ">
        <div className="flex gap-2 flex-wrap">
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  hoverBorderColor: "#0026d9",
                  activeBorderColor: "#0026d9",
                  activeShadow: "none",
                },
                Select: {
                  hoverBorderColor: "#0026d9",
                  activeBorderColor: "#0026d9",
                  activeOutlineColor: "none",
                },
              },
            }}
          >
            <Controller
              control={control}
              name="nr_cnpj"
              render={({ field }) => (
                <CPFInput
                  {...field}
                  format="###.###.###-##"
                  value={field.value || ""}
                  onValueChange={(values) => field.onChange(values.value)}
                  style={{ width: "150px" }}
                />
              )}
            />

            <Controller
              control={control}
              name="nm_cliente"
              render={({ field }) => (
                <Input
                  style={{
                    width: "170px",
                  }}
                  placeholder="Nome"
                  {...field}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="credito_min"
              render={({ field }) => (
                <InputNumber
                  style={{ width: "130px" }}
                  min={0}
                  placeholder="Crédito Mín."
                  value={field.value}
                  onChange={field.onChange}
                  formatter={(value) =>
                    value === undefined || value === null || value === ""
                      ? ""
                      : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value ? value.replace(/[R$\s.]/g, "").replace(",", ".") : ""
                  }
                />
              )}
            />

            <Controller
              control={control}
              name="credito_max"
              render={({ field }) => (
                <InputNumber
                  style={{ width: "130px" }}
                  min={0}
                  placeholder="Crédito Máx."
                  value={field.value}
                  onChange={field.onChange}
                  formatter={(value) =>
                    value === undefined || value === null || value === ""
                      ? ""
                      : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value ? value.replace(/[R$\s.]/g, "").replace(",", ".") : ""
                  }
                />
              )}
            />
          </ConfigProvider>
          <div className="flex gap-2 items-center">
            <Tooltip
              title="Filtrar"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                className={blueOutlineButtonClass}
                style={{
                  width: "24px",
                  height: "28px",
                }}
                htmlType="submit"
              >
                <FilterOutlined />
              </Button>
            </Tooltip>

            <Tooltip
              title="Limpar filtro"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                className={blueOutlineButtonClass}
                onClick={onClear}
                style={{ width: "24px", height: "28px" }}
              >
                X
              </Button>
            </Tooltip>

            <Tooltip
              title="Download"
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button
                className={blueOutlineButtonClass}
                style={{ width: "24px", height: "28px" }}
                onClick={() =>
                  handleExportXLSX({
                    // companies,
                    selectedRowKeys,
                    visibleColumns,
                    tableColumns,
                  })
                }
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div></div>
      <div className="flex  justify-end  ">
        <ConfigProvider
          locale={customLocale}
          theme={{
            components: {
              Checkbox: {
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
                borderRadius: 4,
                controlInteractiveSize: 18,
                lineWidth: 2,
              },
              Dropdown: {
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
              },
            },
          }}
        >
          {/* Tabela para web */}
          <Dropdown
            popupRender={() => (
              <div
                style={{
                  width: 240,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  padding: 12,
                  maxHeight: 300,
                  overflowY: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <style>
                  {`
                            .hide-scrollbar::-webkit-scrollbar {
                              display: none;
                            }
                            `}
                </style>
                <div className="hide-scrollbar">
                  <Checkbox.Group
                    options={allColumnOptions}
                    value={visibleColumns}
                    onChange={handleColumnsChange}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  />
                </div>
              </div>
            )}
            trigger={["click"]}
          >
            {/* <Button>Selecionar Colunas</Button> */}
          </Dropdown>
        </ConfigProvider>
      </div>
    </form>
  );
}
