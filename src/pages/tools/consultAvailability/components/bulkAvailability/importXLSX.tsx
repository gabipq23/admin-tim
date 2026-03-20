import { ConfigProvider, Input, Button, message, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { useBulkAvailabilityStore } from "../../context/bulkAvailabilityContext";
import { useConsultAvailabilityBulkController } from "../../controller/bulkAvailabilityController";
import { useState } from "react";
type Data = any[][];

export default function ImportXLSX() {
  const [form] = Form.useForm();
  const [info, setInfo] = useState<Data>([]);

  const { consultBulk, isConsulting } = useConsultAvailabilityBulkController();
  const setOriginalDados = useBulkAvailabilityStore(
    (state) => state.setOriginalDados,
  );
  const clearOriginalDados = useBulkAvailabilityStore(
    (state) => state.clearOriginalDados,
  );
  const clearBulkResponse = useBulkAvailabilityStore(
    (state) => state.clearBulkResponse,
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const ab = e.target?.result;
        if (ab instanceof ArrayBuffer) {
          const wb = XLSX.read(ab, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const jsonData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

          clearOriginalDados();
          clearBulkResponse();
          setInfo(jsonData);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleFinish = async () => {
    if (info.length <= 1) {
      message.error("Arquivo deve conter dados além do cabeçalho");
      return;
    }

    const processedData = info
      .slice(1)
      .map((row: any[]) => {
        const cep = row[0]?.toString().replace(/\D/g, "");
        const numero = row[1]?.toString().trim();

        return {
          cep,
          ...(numero && numero !== "" ? { numero } : {}),
        };
      })
      .filter((item: any) => item.cep && item.cep.length === 8);

    if (processedData.length === 0) {
      message.error("Nenhum CEP válido encontrado no arquivo");
      return;
    }

    setOriginalDados(processedData);

    consultBulk({
      dados: processedData,
      limite: processedData.length,
      page: 1,
    });
  };
  return (
    <>
      <div className=" bg-neutral-50 rounded-xl p-4 mt-4 w-full lg:w-2/4">
        <div className="flex flex-col gap-2 justify-between">
          <h1 className="text-[22px] ">Consulta de disponibilidade em massa</h1>
          <div className=" flex gap-1 items-center text-[14px]  text-neutral-500">
            <p>
              Faça o upload de um arquivo .xlsx ou .xls para consultar a
              disponibilidade de múltiplos CEPs e números.
            </p>
          </div>
        </div>

        <div className="w-64 flex mt-3 flex-col gap-4">
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  activeBorderColor: "#660099",
                  hoverBorderColor: "#660099",
                },
                Button: {
                  colorPrimary: "#660099",
                  colorPrimaryHover: "#cb1ef5",
                },
              },
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              className="flex "
            >
              <Form.Item>
                <Input
                  className="cursor-pointer"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  size="middle"
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    width: "200px",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isConsulting}
                  disabled={isConsulting || info.length <= 1}
                  style={{
                    backgroundColor: "#660099",
                    color: "white",
                    borderColor: "#660099",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    height: "32px",
                  }}
                >
                  {<SearchOutlined />}
                </Button>
              </Form.Item>
            </Form>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}
