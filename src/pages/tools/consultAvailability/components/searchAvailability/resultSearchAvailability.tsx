import { Button, Checkbox, ConfigProvider, Dropdown, Table } from "antd";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { customLocale } from "@/utils/customLocale";
import { useState, useEffect } from "react";

import { DownloadOutlined } from "@ant-design/icons";
import {
  useExportAvailabilityController,
  useExportAvailabilityCSVController,
  useExportAvailabilityTXTController,
} from "../../controller/exportSearch";
import { useSearchAvailabilityController } from "../../controller/searchAvailabilityController";
interface SearchParams {
  uf?: string;
  cidade?: string;
  bairro?: string;
  cep?: string;
  numero?: string;
}
function getFiltersFromURL(): {
  page: number;
  limit: number;
  uf?: string;
  cidade?: string;
  bairro?: string;
  cep?: string;
  numero?: string;
} {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page") || "1", 10);
  const limit = parseInt(params.get("limit") || "100", 10);

  return {
    page,
    limit,
    uf: params.get("uf") || undefined,
    cidade: params.get("cidade") || undefined,
    bairro: params.get("bairro") || undefined,
    cep: params.get("cep") || undefined,
    numero: params.get("numero") || undefined,
  };
}

export default function ResultSearchAvailability() {
  const location = useLocation();
  const navigate = useNavigate();
  const filters = getFiltersFromURL();
  const { exportData, isExporting } = useExportAvailabilityController();
  const { exportDataCSV, isExportingCSV } =
    useExportAvailabilityCSVController();
  const { exportDataTXT, isExportingTXT } =
    useExportAvailabilityTXTController();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const currentPage = filters.page;
  const pageSize = filters.limit;

  const {
    styles,
    tableColumns,
    searchData,
    isSearchLoading,
    visibleColumns,
    allColumnOptions,
    handleColumnsChange,
    allTableColumns,
  } = useSearchAvailabilityController({
    uf: searchParams?.uf || location.state?.uf || filters.uf,
    cidade:
      searchParams?.cidade || location.state?.cidade || filters.cidade || "",
    bairro:
      searchParams?.bairro || location.state?.bairro || filters.bairro || "",
    limite: pageSize,
    cep: searchParams?.cep || location.state?.cep || filters.cep || "",
    numero:
      searchParams?.numero || location.state?.numero || filters.numero || "",
    page: currentPage,
  });

  useEffect(() => {
    if (location.state && !searchParams) {
      setSearchParams({
        uf: location.state.uf,
        cidade: location.state.cidade,
        bairro: location.state.bairro,
        cep: location.state.cep,
        numero: location.state.numero,
      });
    } else if (filters.uf && !searchParams) {
      setSearchParams({
        uf: filters.uf,
        cidade: filters.cidade || "",
        bairro: filters.bairro || "",
        cep: filters.cep || "",
        numero: filters.numero || "",
      });
    }
  }, [location.state, filters, searchParams]);

  if (!location.state && !filters.uf && !searchParams) {
    navigate("/admin/consulta-disponibilidade");
    return null;
  }

  const totalItems = searchData?.paginacao?.total || 0;

  const handleExport = () => {
    const params = {
      uf: searchParams?.uf || location.state?.uf || filters.uf,
      cidade: searchParams?.cidade || location.state?.cidade || filters.cidade,
      bairro: searchParams?.bairro || location.state?.bairro || filters.bairro,
      cep: searchParams?.cep || location.state?.cep || filters.cep,
      numero: searchParams?.numero || location.state?.numero || filters.numero,
      total: totalItems,
      visibleColumns,
      allTableColumns,
    };

    exportData(params);
  };

  const handleExportCSV = () => {
    const params = {
      uf: searchParams?.uf || location.state?.uf || filters.uf,
      cidade: searchParams?.cidade || location.state?.cidade || filters.cidade,
      bairro: searchParams?.bairro || location.state?.bairro || filters.bairro,
      cep: searchParams?.cep || location.state?.cep || filters.cep,
      numero: searchParams?.numero || location.state?.numero || filters.numero,
      total: totalItems,
      visibleColumns,
      allTableColumns,
    };
    exportDataCSV(params);
  };

  const handleExportTXT = () => {
    const params = {
      uf: searchParams?.uf || location.state?.uf || filters.uf,
      cidade: searchParams?.cidade || location.state?.cidade || filters.cidade,
      bairro: searchParams?.bairro || location.state?.bairro || filters.bairro,
      cep: searchParams?.cep || location.state?.cep || filters.cep,
      numero: searchParams?.numero || location.state?.numero || filters.numero,
      total: totalItems,
      visibleColumns,
      allTableColumns,
    };
    exportDataTXT(params);
  };
  return (
    <>
      <div className="px-6 md:px-10 lg:px-14">
        <div className="flex  gap-8 justify-between mt-6 mb-2">
          <h1 className="text-[22px]  pl-16">Resultado de Disponibilidade</h1>

          <div className="flex gap-2 mb-2">
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorBorder: "#660099",
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
                onClick={handleExport}
                disabled={!searchData?.dados || searchData.dados.length === 0}
                style={{
                  backgroundColor: "#660099",
                  borderColor: "#660099",
                }}
              >
                {isExporting ? "Exportando..." : `Exportar em .xlsx`}
              </Button>{" "}
              <Button
                type="default"
                variant="solid"
                icon={<DownloadOutlined />}
                loading={isExportingCSV}
                onClick={handleExportCSV}
                disabled={!searchData?.dados || searchData.dados.length === 0}
                style={{
                  backgroundColor: "#660099",
                  borderColor: "#660099",
                }}
              >
                {isExportingCSV ? "Exportando..." : `Exportar em .csv`}
              </Button>{" "}
              <Button
                type="default"
                variant="solid"
                icon={<DownloadOutlined />}
                loading={isExportingTXT}
                onClick={handleExportTXT}
                disabled={!searchData?.dados || searchData.dados.length === 0}
                style={{
                  backgroundColor: "#660099",
                  borderColor: "#660099",
                }}
              >
                {isExportingTXT ? "Exportando..." : `Exportar em .txt`}
              </Button>{" "}
            </ConfigProvider>
            <div className="flex  justify-end  ">
              <ConfigProvider
                locale={customLocale}
                theme={{
                  components: {
                    Checkbox: {
                      colorPrimary: "#660099",
                      colorPrimaryHover: "#660099",
                      borderRadius: 4,
                      controlInteractiveSize: 18,
                      lineWidth: 2,
                    },
                    Button: {
                      colorBorder: "#660099",
                      colorText: "#660099",
                      colorPrimaryHover: "#cb1ef5",
                      colorPrimaryBorderHover: "#cb1ef5",
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
                  trigger={["click", "hover"]}
                >
                  <Button>Selecionar Colunas</Button>
                </Dropdown>
              </ConfigProvider>
            </div>
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorBorder: "#660099",
                    colorText: "#660099",
                    colorPrimaryHover: "#cb1ef5",
                    colorPrimaryBorderHover: "#cb1ef5",
                  },
                },
              }}
            >
              <div className=" self-end">
                <Button
                  type="default"
                  variant="solid"
                  className=""
                  onClick={() => {
                    navigate("/admin/consulta-disponibilidade");
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Voltar para consulta</span>
                </Button>
              </div>
            </ConfigProvider>
          </div>
        </div>

        <ConfigProvider
          locale={customLocale}
          theme={{
            token: {
              colorPrimary: "#660099",
              colorPrimaryHover: "#833baa",
              colorLink: "#660099",
              colorPrimaryBg: "transparent",
            },
            components: {
              Checkbox: {
                colorPrimary: "#660099",
                colorPrimaryHover: "#660099",
                borderRadius: 4,
                controlInteractiveSize: 18,
                lineWidth: 2,
              },
            },
          }}
        >
          <div className=" overflow-y-auto ">
            <Table<any>
              rowKey="id"
              loading={isSearchLoading}
              className={styles?.customTable}
              columns={tableColumns}
              dataSource={searchData?.dados || []}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["50", "100", "200", "500"],
                showLessItems: true,
                onChange: (page, newPageSize) => {
                  const currentParams = new URLSearchParams(
                    window.location.search
                  );
                  currentParams.set("page", page.toString());
                  currentParams.set("limit", newPageSize.toString());
                  navigate(`?${currentParams.toString()}`);
                },
                showTotal: (total) => `Total de ${total}`,
              }}
            />
          </div>
        </ConfigProvider>
      </div>
    </>
  );
}
