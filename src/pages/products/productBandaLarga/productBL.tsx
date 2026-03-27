import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Table } from "antd";
import { customLocale } from "@/utils/customLocale";
import { useProductBLController } from "./controllers/dataController";
import { useProductsBLFilterController } from "./controllers/filterController";
import { FilterProductBL } from "./components/ProductBLFilter";
import ProductBLInfoModal from "./modals/InfoProductBL";
import { IProduct } from "@/interfaces/products";

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
    uploadProductConditionsBL,
    uploadProductDetailsBL,
    uploadProductExtrasBL,
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
  } = useProductsBLFilterController(updateProductBL);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="px-6 md:px-10 lg:px-14 ">

          <div className="flex justify-between mt-6 items-center mb-4">
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
                uploadProductConditionsBL={uploadProductConditionsBL}
                uploadProductDetailsBL={uploadProductDetailsBL}
                uploadProductExtrasBL={uploadProductExtrasBL}
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
              <Table<IProduct>
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
            uploadProductConditionsBL={uploadProductConditionsBL}
            uploadProductDetailsBL={uploadProductDetailsBL}
            uploadProductExtrasBL={uploadProductExtrasBL}
          />
        </div>
      </QueryClientProvider>
    </>
  );
}
