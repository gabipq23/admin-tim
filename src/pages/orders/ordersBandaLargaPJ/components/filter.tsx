import { Controller } from "react-hook-form";
import { Input, Button, Tooltip, ConfigProvider, Select } from "antd";
import { DownloadOutlined, FilterOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import ptBR from "antd/es/locale/pt_BR";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { handleExportXLSX } from "../controllers/exportXLSX";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";

interface FiltroPedidosPJFormProps {
  control: any;
  handleSubmit: any;
  onSubmit: any;
  onClear: () => void;
  selectedRowKeys: any;
  statusOptions?: string[];
  orderBandaLargaPJ: any;
  planBLPJStock?: any;
}

const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    placeholder="CNPJ"
    size="middle"
  />
);
export function FiltroOrdersBandaLargaPJForm({
  control,
  handleSubmit,
  onSubmit,
  statusOptions,
  onClear,
  selectedRowKeys,
  orderBandaLargaPJ,
  planBLPJStock,
}: FiltroPedidosPJFormProps) {
  const { RangePicker } = DatePicker;

  const uniquePlans = Array.isArray(planBLPJStock)
    ? Array.from(
      new Map(
        planBLPJStock.map((plan: any) => [plan.plan_name, plan])
      ).values()
    )
    : [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={onClear}
      className="flex min-w-[200px] flex-wrap gap-2 mt-4"
    >
      <div className="flex gap-2 flex-wrap">
        <ConfigProvider
          locale={ptBR}
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
              DatePicker: {
                hoverBorderColor: "#0026d9",
                activeBorderColor: "#0026d9",
                colorPrimaryBorder: "#0026d9",
                colorPrimary: "#0026d9",
              },
            },
          }}
        >
          <Controller
            control={control}
            name="ordernumber"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="ID do Pedido"
                value={field.value || ""}
                onChange={field.onChange}
                style={{
                  width: "115px",
                }}
                maxLength={13}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                mode="multiple"
                style={{ minWidth: "120px" }}
                placeholder="Pedido"
                value={field.value?.length ? field.value : []}
                onChange={field.onChange}
                options={[
                  { value: "aberto", label: "Aberto" },
                  { value: "fechado", label: "Fechado" },
                  { value: "cancelado", label: "Cancelado" },
                ]}
                allowClear
              />
            )}
          />
          <Controller
            control={control}
            name="initial_status"
            render={({ field }) => (
              <Select
                mode="multiple"
                style={{ minWidth: "130px" }}
                placeholder="Status inicial"
                value={field.value?.length ? field.value : []}
                onChange={field.onChange}
                options={[
                  { value: "consulta", label: "Consulta" },
                  { value: "pedido", label: "Pedido" },
                ]}
                allowClear
              />
            )}
          />
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select
                style={{ minWidth: "120px" }}
                placeholder="Disponibilidade"
                value={field.value || undefined}
                onChange={field.onChange}
                options={[
                  { value: true, label: "Disponível" },
                  { value: false, label: "Indisponível" },
                ]}
                allowClear
              />
            )}
          />
          <Controller
            control={control}
            name="cnpj"
            render={({ field }) => (
              <CNPJInput
                {...field}
                format="##.###.###/####-##"
                value={field.value || ""}
                onValueChange={(values) => field.onChange(values.value)}
                style={{ width: "150px" }}
              />
            )}
          />
          <Controller
            control={control}
            name="razaosocial"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Razão Social"
                value={field.value || ""}
                onChange={field.onChange}
                style={{
                  width: "170px",
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Telefone"
                value={field.value || ""}
                onChange={field.onChange}
                style={{
                  width: "110px",
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="plan"
            render={({ field }) => (
              <Select
                style={{ minWidth: "200px" }}
                placeholder="Plano"
                value={field.value?.length ? field.value : []}
                onChange={field.onChange}
                options={uniquePlans.map((plan: any) => ({
                  value: plan.plan_name,
                  label: plan.plan_name,
                }))}
                allowClear
              />
            )}
          />{" "}
          <Controller
            control={control}
            name="status_pos_venda"
            render={({ field }) => (
              <Select
                style={{
                  width: "300px",
                }}
                placeholder="Status do Pedido"
                value={field.value || undefined}
                onChange={field.onChange}
                options={statusOptions?.map((status: string) => ({
                  value: status,
                  label: status,
                }))}
                allowClear
              />
            )}
          />
          {/* Período de datas: data_de (início) e data_ate (fim) */}
          <Controller
            control={control}
            name="data_de"
            render={({ field: fieldDe }) => (
              <Controller
                control={control}
                name="data_ate"
                render={({ field: fieldAte }) => (
                  <RangePicker
                    style={{
                      width: "215px",
                    }}
                    value={
                      fieldDe.value && fieldAte.value
                        ? [
                          fieldDe.value
                            ? dayjs(decodeURIComponent(fieldDe.value))
                            : null,
                          fieldAte.value
                            ? dayjs(decodeURIComponent(fieldAte.value))
                            : null,
                        ]
                        : [null, null]
                    }
                    format="DD/MM/YYYY"
                    onChange={(dates) => {
                      fieldDe.onChange(
                        dates && dates[0]
                          ? encodeURIComponent(
                            dates[0].startOf("day").format("YYYY-MM-DD")
                          )
                          : null
                      );
                      fieldAte.onChange(
                        dates && dates[1]
                          ? encodeURIComponent(
                            dates[1].endOf("day").format("YYYY-MM-DD")
                          )
                          : null
                      );
                    }}
                    allowClear
                    placeholder={["de", "até"]}
                  />
                )}
              />
            )}
          />
        </ConfigProvider>
      </div>

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
            onClick={() => handleExportXLSX(orderBandaLargaPJ, selectedRowKeys)}
          >
            <DownloadOutlined />
          </Button>
        </Tooltip>
      </div>
    </form>
  );
}
