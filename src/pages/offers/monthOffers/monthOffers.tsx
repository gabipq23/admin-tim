
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Table } from "antd";
import { useMonthOffersFilterController } from "./controller/filterController";

import { customLocale } from "@/utils/customLocale";
import { useMonthOffersController } from "./controller/dataController";
import { ModalObs } from "./modals/modalObs";
import { ModalUpload } from "./modals/modalUpload";
import { useState } from "react";
import { MonthOffer } from "@/interfaces/monthOffer";
import { ModalDelete } from "./modals/modalDelete";
import { FiltroMonthOffers } from "./components/filter";

export default function MonthOffers() {
  const queryClient = new QueryClient();
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
    downloadFile({ id: item.id, fileName: item.name });
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
          <FiltroMonthOffers handleSubmit={handleSubmit} onSubmit={onSubmit} clearFilters={clearFilters} control={control} setShowUploadModal={setShowUploadModal} />

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
                  dataSource={Array.isArray(offers?.offers) ? offers.offers : []}
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

