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
import { useState } from "react";
import { ConsultAvailabilityService } from "@/services/consultAvailability";
import { useBulkAvailabilityStore } from "../../context/bulkAvailabilityContext";
import { tableColumns } from "./tableColumns";
import { useStyle } from "@/style/tableStyle";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";

export default function ResultBulkAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData: IBulkAvailabilityResponse = location.state;
  const { styles } = useStyle();
  const { exportData, isExporting } = useExportBulkAvailabilityController();
  const { exportDataCSV, isExportingCSV } =
    useExportBulkAvailabilityCSVController();

  const [currentData, setCurrentData] = useState(initialData);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const consultAvailabilityService = new ConsultAvailabilityService();
  const originalDados = useBulkAvailabilityStore(
    (state) => state.originalDados,
  );

  if (!initialData || !initialData.resultados) {
    navigate("/admin/consulta-disponibilidade");
    return null;
  }

  const totalItems =
    currentData.paginacao?.total || currentData.relatorio?.total || 0;

  const handlePageChange = async (page: number, pageSize?: number) => {
    if (originalDados.length === 0) {
      console.error(
        "❌ originalDados está vazio! Não é possível fazer paginação.",
      );
      return;
    }

    setIsLoadingPage(true);
    try {
      const response = await consultAvailabilityService.consultAvailabilityBulk(
        originalDados,
        pageSize || currentData.paginacao?.limite || 500,
        page,
      );
      setCurrentData(response);
    } catch (error) {
      console.error("Erro ao carregar página:", error);
    } finally {
      setIsLoadingPage(false);
    }
  };

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
                className={blueOutlineButtonClass}
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
              colorPrimaryHover: "#0026d9",
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
              loading={isLoadingPage}
              pagination={{
                current: currentData.paginacao?.pagina || 1,
                pageSize: currentData.paginacao?.limite || 500,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["50", "100", "200", "500"],
                showLessItems: true,
                onChange: handlePageChange,
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
