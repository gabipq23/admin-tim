import { FilterOutlined, UploadOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, ConfigProvider, Input, Modal, Table, Tooltip } from "antd";
import { useMonthOffersFilterController } from "./controller/filterController";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import { customLocale } from "@/utils/customLocale";
import { blueOutlineButtonClass, redOutlineButtonClass } from "@/utils/buttonStyles";
import { useMonthOffersController } from "./controller/dataController";
import { ModalObs } from "./components/modalObs";
import { ModalUpload } from "./components/modalUpload";
import { useState } from "react";
import { MonthOffer } from "@/interfaces/monthOffer";

export default function MonthOffers() {
  const queryClient = new QueryClient();
  const { RangePicker } = DatePicker;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MonthOffer | null>(null);

  const {
    offers,
    isLoading,
    updateMonthOffer,
    removeOffers,
    createMonthOffers,
    isUploadPending,
    downloadFile,
  } = useMonthOffersController();

  const handleEditDescription = (item: MonthOffer) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = (item: MonthOffer) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDownloadItem = (item: MonthOffer) => {
    downloadFile({ id: item.id, fileName: item.nome });
  };

  const {
    styles,
    tableColumns,
    control,
    onSubmit,
    handleSubmit,

    clearFilters,
  } = useMonthOffersFilterController({
    onEditDescription: handleEditDescription,
    onDeleteItem: handleDeleteItem,
    onDownloadItem: handleDownloadItem,
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 h-[calc(100vh-160px)]">
          <div className="flex w-full justify-between mt-3 pb-4">
            <h1 className="text-[22px]">Book de Ofertas</h1>
          </div>
          <div className="flex items-center justify-between">
            <form
              onSubmit={handleSubmit(onSubmit)}
              onReset={clearFilters}
              className="flex min-w-[200px] flex-wrap gap-2 mb-4"
            >
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
                    name="nome"
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Nome"
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
                    name="dataDe"
                    render={({ field: fieldDe }) => (
                      <Controller
                        control={control}
                        name="dataAte"
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
                                    ? dayjs(
                                      decodeURIComponent(fieldAte.value)
                                    )
                                    : null,
                                ]
                                : [null, null]
                            }
                            format="DD/MM/YYYY"
                            onChange={(dates) => {
                              fieldDe.onChange(
                                dates && dates[0]
                                  ? encodeURIComponent(
                                    dates[0]
                                      .startOf("day")
                                      .format("YYYY-MM-DD")
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
                    style={{ width: "24px", height: "28px" }}
                    onClick={clearFilters}
                  >
                    X
                  </Button>
                </Tooltip>
              </div>
            </form>

            <div>
              <ConfigProvider
                theme={{
                  components: {
                    Button: {
                      colorBorder: "#0026d9",
                      colorText: "#0026d9",
                      colorPrimary: "#0026d9",

                    },
                  },
                }}
              >
                <Button
                  className={blueOutlineButtonClass}
                  icon={<UploadOutlined />}
                  onClick={() => setShowUploadModal(true)}
                >
                  Novo arquivo
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
            }}
          >
            <div className="mt-4">
              <div className="overflow-y-auto">
                <Table<MonthOffer>
                  rowKey="id"
                  className={styles?.customTable}
                  columns={tableColumns}
                  dataSource={offers ? offers : []}
                  loading={isLoading}
                  pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ["50", "100", "200", "500"],
                    showLessItems: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} de ${total} arquivos`,
                  }}
                />
              </div>
            </div>
          </ConfigProvider>
        </div>

        {/* Modais */}
        <ModalObs
          updateMonthOffer={updateMonthOffer}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          selectedItem={selectedItem}
        />
        <ModalUpload
          showModal={showUploadModal}
          setShowModal={setShowUploadModal}
          createMonthOffers={createMonthOffers}
          isUploadPending={isUploadPending}
        />
        <ModalDelete
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          selectedItem={selectedItem}
          removeOffers={removeOffers}
        />
      </QueryClientProvider>
    </>
  );
}

export function ModalDelete({
  showDeleteModal,
  setShowDeleteModal,
  selectedItem,
  removeOffers,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  selectedItem: MonthOffer | null;
  removeOffers: any;
}) {
  const handleDelete = () => {
    if (selectedItem) {
      removeOffers({ id: selectedItem?.id });
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <Modal
        centered
        title={
          <span style={{ color: "#252525" }}>
            Tem certeza que deseja remover esse arquivo?
          </span>
        }
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
        width={600}
      >
        {selectedItem && (
          <div className="mb-4">
            <p>
              <strong>Nome:</strong> {selectedItem.nome}
            </p>
          </div>
        )}
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorBorder: "#0026d9",
                colorText: "#0026d9",
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#883fa2",
              },
            },
          }}
        >
          <div
            className="flex justify-end gap-4 z-10"
            style={{
              position: "sticky",
              bottom: -1,
              left: 0,
              right: 0,
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            <Button
              className={blueOutlineButtonClass}
              onClick={() => setShowDeleteModal(false)}
              style={{
                fontSize: "14px",
              }}
            >
              Cancelar
            </Button>
            <Button
              className={redOutlineButtonClass}
              onClick={handleDelete}
              style={{
                fontSize: "14px",
              }}
              danger
            >
              Remover
            </Button>
          </div>
        </ConfigProvider>
      </Modal>
    </>
  );
}
