import { MonthOffer } from "@/interfaces/monthOffer";
import { blueOutlineButtonClass, redOutlineButtonClass } from "@/utils/buttonStyles";
import { Button, ConfigProvider, Modal } from "antd";

export function ModalDelete({
    showDeleteModal,
    setShowDeleteModal,
    selectedItem,
    removeOffers,
}: {
    showDeleteModal: boolean;
    setShowDeleteModal: (show: boolean) => void;
    selectedItem: MonthOffer | null;
    removeOffers: (params: { id: number }) => void;
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
                            <strong>Nome:</strong> {selectedItem.name}
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
                                colorPrimaryHover: "#0026d9",
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