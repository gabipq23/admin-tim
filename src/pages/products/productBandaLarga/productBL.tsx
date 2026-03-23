import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Table } from "antd";
import { customLocale } from "@/utils/customLocale";
import { useProductBLController } from "./controllers/dataController";
import { useProductsBLFilterController } from "./controllers/filterController";
import { FilterProductBL } from "./components/filter";
import ProductBLInfoModal from "./modals/BLPJInfo";

export default function ProductBL() {
  const queryClient = new QueryClient();
  const {
    isModalOpen,
    showModal,
    closeModal,
    showEditProductLayout,
    setShowEditProductLayout,
    productsBL,
    productBLQueryFetching,
    updateProductBL,
    removeProductBL,
    createProductBL,
  } = useProductBLController();

  const {
    setSelectedProductId,
    selectedProductId,
    tableColumns,
    styles,
    control,
    handleSubmit,
    onSubmit,
    clearFilters,
    isFiltered,
  } = useProductsBLFilterController();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col px-6 md:px-10 lg:px-14 pt-4 h-[calc(100vh-160px)]">
          <div className="flex justify-between  mt-6  mb-4">
            <div>
              <div className="flex  gap-8 justify-between mb-2">
                <h1 className="text-[22px]">Banda Larga</h1>
              </div>
              <FilterProductBL
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                onClear={clearFilters}
                isFiltered={isFiltered}
                createProductBL={createProductBL}
              />
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
            {/* Tabela  */}
            <div className="overflow-y-auto mb-4">
              <Table<any>
                sticky={{ offsetHeader: 0 }}
                className={styles.customTable}
                loading={productBLQueryFetching}
                columns={tableColumns}
                dataSource={productsBL}
                pagination={
                  productsBL.length > 20
                    ? {
                      pageSize: 20,
                      showSizeChanger: false,
                    }
                    : false
                }
                onRow={(record) => ({
                  onClick: (event) => {
                    const target = event.target as HTMLElement;
                    if (
                      target.closest(".ant-switch") ||
                      target.closest(".actions-online-cell")
                    ) {
                      return;
                    }
                    setSelectedProductId(record.id);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
              />
            </div>
          </ConfigProvider>

          <ProductBLInfoModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            showEditProductLayout={showEditProductLayout}
            setShowEditProductLayout={setShowEditProductLayout}
            planData={
              productsBL.find(
                (product) => product?.id === selectedProductId,
              ) || null
            }
            updateProductBL={updateProductBL}
            removeProductBL={removeProductBL}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}
