import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Modal, Table } from "antd";
import { customLocale } from "@/utils/customLocale";
import { useAllOrdersController } from "./controllers/dataController";
import { useAllOrdersFilterController } from "./controllers/filterController";
import { useNavigate } from "react-router-dom";
import { FiltroOrdersBandaLargaPJForm } from "./components/filter";
import { OrderBandaLarga } from "@/interfaces/orderBandaLarga";
import { TableProps } from "antd/lib";
import { useState } from "react";
import { OrderBandaLargaPJDetailsModal } from "./modals/orderBandaLargaPJDetails";
import { useProductBLController } from "@/pages/products/productBandaLarga/controllers/dataController";
export default function OrdersBandaLargaPJ() {
  const queryClient = new QueryClient();
  const {
    control,
    onSubmit,
    handleSubmit,
    clearFilters,
    selectedBLOrder,
    setSelectedBLOrder,
    currentPage,
    pageSize,
    columns,
    styles,
    allColumnOptions,
    visibleColumns,
    handleColumnsChange,
    isModalAvatarOpen,
    setIsModalAvatarOpen,
    selectedAvatar,
  } = useAllOrdersFilterController();
  const {
    ordersBandaLarga,
    showModal,
    closeModal,
    isModalOpen,
    isLoading,
    orderBandaLargaPJ,
    updateBandaLargaOrder,
    removeBandaLargaOrder,
    isRemoveBandaLargaOrderFetching,
    changeBandaLargaOrderStatus,
    updateDataIdCRMAndConsultorResponsavel
  } = useAllOrdersController(setSelectedBLOrder);
  const navigate = useNavigate();
  const { productsBL } = useProductBLController();

  const totalItems =
    ordersBandaLarga?.total ?? orderBandaLargaPJ?.length ?? 0;

  const rowClassName = (record: OrderBandaLarga) => {
    const hasAvaiability = record?.availability;
    const isCoveredByRange = record?.found_via_range;
    const hasUnicCep = record?.single_zip_code;
    if (record?.status === "FECHADO" || record?.status === "fechado") {
      if (
        hasAvaiability === false ||
        hasAvaiability === null ||
        hasAvaiability === 0
      ) {
        return "ant-table-row-red";
      } else if (isCoveredByRange || hasUnicCep) {
        return "ant-table-row-yellow";
      }

      return "ant-table-row-green";
    }
    return "";
  };
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const rowSelection: TableProps<any>["rowSelection"] = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="px-6 md:px-10 lg:px-14">
          <div className="flex justify-between mt-6 mb-4 items-center">
            <div>
              <div className="flex gap-8 justify-between pb-2">
                <h1 className="text-[22px] pl-16 ">Pedidos Banda Larga PJ</h1>
              </div>
              {/* Filtro */}
              <FiltroOrdersBandaLargaPJForm
                control={control}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                selectedRowKeys={selectedRowKeys}
                onClear={clearFilters}
                statusOptions={ordersBandaLarga?.status_pos_venda_enum}
                orderBandaLargaPJ={orderBandaLargaPJ}
                planBLPJStock={productsBL}
                allColumnOptions={allColumnOptions}
                visibleColumns={visibleColumns}
                handleColumnsChange={handleColumnsChange}
                tableColumns={columns}
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
            {/* Tabela */}
            <div className="overflow-y-auto ">
              <Table<any>
                rowKey="id"
                loading={isLoading}
                scroll={{ y: 800 }}
                rowSelection={rowSelection}
                className={styles.customTable}
                dataSource={orderBandaLargaPJ}
                rowClassName={(record) => rowClassName(record) ?? ""}
                columns={columns}
                onRow={(record) => ({
                  onClick: () => {
                    setSelectedBLOrder(record);
                    showModal();
                  },
                  style: { cursor: "pointer" },
                })}
                pagination={{
                  current: currentPage ? Number(currentPage) : 1,
                  pageSize: pageSize ? Number(pageSize) : 50,
                  total: totalItems,
                  showSizeChanger: true,
                  pageSizeOptions: ["20", "50", "100", "200", "500"],
                  showLessItems: true,
                  onChange: (page, pageSize) => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("page", page.toString());
                    params.set("per_page", pageSize.toString());
                    navigate(`?${params.toString()}`);
                  },
                  showTotal: (total) => `Total de ${total} pedidos`,
                }}
              />
            </div>
          </ConfigProvider>

          {/* Modal */}
          <OrderBandaLargaPJDetailsModal
            statusOptions={ordersBandaLarga?.status_pos_venda_enum}
            planBLPJStock={productsBL}
            updateOrderData={updateBandaLargaOrder}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedId={selectedBLOrder}
            removeOrderData={removeBandaLargaOrder}
            isRemoveOrderFetching={isRemoveBandaLargaOrderFetching}
            updateDataIdCRMAndConsultorResponsavel={updateDataIdCRMAndConsultorResponsavel}
            changeBandaLargaOrderStatus={changeBandaLargaOrderStatus}
          />
        </div>
        {isModalAvatarOpen && (
          <Modal
            open={isModalAvatarOpen}
            onCancel={() => setIsModalAvatarOpen(false)}
            title="Foto de perfil"
            footer={null}
          >
            <div className="w-full flex items-center justify-center py-2">
              <img
                className="w-60 h-60 max-w-full rounded-md object-cover object-center"
                src={selectedAvatar ?? "/assets/anonymous_avatar.png"}
                alt="Avatar"
              />
            </div>
          </Modal>

        )}

      </QueryClientProvider>
    </>
  );
}

