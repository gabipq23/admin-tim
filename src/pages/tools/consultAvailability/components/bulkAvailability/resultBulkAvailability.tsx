import { Button, ConfigProvider, Table } from "antd";

import { ArrowLeft } from "lucide-react";
import { DownloadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { customLocale } from "@/utils/customLocale";
import {
  IBulkAvailabilityResponse,
  IBulkAvailabilityResult,
} from "@/interfaces/availability";
import {
  useExportBulkAvailabilityController,
  useExportBulkAvailabilityCSVController,
} from "../../controller/exportBulk";
import { useBulkAvailabilityStore } from "../../context/bulkAvailabilityContext";
import { tableColumns } from "./tableColumns";
import { useStyle } from "@/style/tableStyle";

export default function ResultBulkAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData: IBulkAvailabilityResponse = location.state;
  const { styles } = useStyle();
  const { exportData, isExporting } = useExportBulkAvailabilityController();
  const { exportDataCSV, isExportingCSV } =
    useExportBulkAvailabilityCSVController();
  const cachedBulkResponse = useBulkAvailabilityStore(
    (state) => state.bulkResponse,
  );
  const currentData = cachedBulkResponse ?? initialData;

  if (!currentData || !currentData.resultados) {
    navigate("/admin/consulta-disponibilidade");
    return null;
  }

  const totalItems = currentData.resultados?.length || 0;

  const exportToExcel = () => {
    exportData();
  };

  const exportToCSV = () => {
    exportDataCSV();
  };

  return (
    <>
      <div className="px-6 md:px-10 lg:px-14">
        <div className="flex gap-4 justify-between mt-6 mb-4">
          <h1 className="text-[22px] pl-16">Resultado da Consulta em Massa</h1>

          <div className="flex gap-2 mb-2">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorBorder: "#0026d9",
                    colorText: "#fff",
                    colorPrimaryHover: "#fff",
                    colorPrimaryBorderHover: "#cb1ef5",
                  },
                },
              }}
            >
              <Button
                type="default"
                variant="solid"
                icon={<DownloadOutlined />}
                loading={isExporting}
                onClick={exportToExcel}
                disabled={
                  !currentData?.resultados ||
                  currentData.resultados.length === 0
                }
                style={{
                  backgroundColor: "#0026d9",
                  borderColor: "#0026d9",
                }}
              >
                {isExporting ? "Exportando..." : "Exportar em .xlsx"}
              </Button>
              <Button
                type="default"
                variant="solid"
                icon={<DownloadOutlined />}
                loading={isExportingCSV}
                onClick={exportToCSV}
                disabled={
                  !currentData?.resultados ||
                  currentData.resultados.length === 0
                }
                style={{
                  backgroundColor: "#0026d9",
                  borderColor: "#0026d9",
                }}
              >
                {isExportingCSV ? "Exportando..." : "Exportar em .csv"}
              </Button>
            </ConfigProvider>

            {/* Botão Voltar */}
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorBorder: "#0026d9",
                    colorText: "#0026d9",
                    colorPrimaryHover: "#cb1ef5",
                    colorPrimaryBorderHover: "#cb1ef5",
                  },
                },
              }}
            >
              <Button
                type="default"
                variant="solid"
                onClick={() => {
                  navigate("/admin/consulta-disponibilidade");
                }}
              >
                <ArrowLeft size={14} />
                <span>Voltar para consulta</span>
              </Button>
            </ConfigProvider>
          </div>
        </div>

        <ConfigProvider
          locale={customLocale}
          theme={{
            token: {
              colorPrimary: "#0026d9",
              colorPrimaryHover: "#833baa",
              colorLink: "#0026d9",
              colorPrimaryBg: "transparent",
            },
            components: {
              Checkbox: {
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
                borderRadius: 4,
                controlInteractiveSize: 18,
                lineWidth: 2,
              },
            },
          }}
        >
          <div className="overflow-y-auto">
            <Table<IBulkAvailabilityResult>
              rowKey="linha"
              className={styles?.customTable}
              columns={tableColumns}
              dataSource={currentData.resultados || []}
              pagination={{
                pageSize: 50,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["50", "100", "200", "500"],
                showLessItems: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} de ${total} registros`,
              }}
            />
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
