import { Button, ConfigProvider, Input, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { UploadProps, UploadFile } from "antd";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";

export function ModalUpload({
  showModal,
  setShowModal,
  createMonthOffers,
  isUploadPending,
}: {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  createMonthOffers: (params: { file: File; description: string }) => void;
  isUploadPending: boolean;
}) {
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleClose = () => {
    setShowModal(false);
    setDescription("");
    setSelectedFile(null);
    setFileList([]);
  };

  const handleSave = () => {
    if (!selectedFile) {
      message.error("Por favor, selecione um arquivo!");
      return;
    }

    createMonthOffers({
      file: selectedFile,
      description: description,
    });

    handleClose();
  };

  const uploadProps: UploadProps = {
    name: "arquivo",
    accept: ".pdf,.xlsx,.xls",
    maxCount: 1,
    fileList: fileList,
    beforeUpload: (file) => {
      const isValidType =
        file.type === "application/pdf" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";

      if (!isValidType) {
        message.error("Apenas arquivos PDF ou XLSX são permitidos!");
        return Upload.LIST_IGNORE;
      }

      setSelectedFile(file);
      setFileList([
        {
          uid: file.uid || Date.now().toString(),
          name: file.name,
          status: "done",
          originFileObj: file,
        },
      ]);

      return false;
    },
    onRemove: () => {
      setSelectedFile(null);
      setFileList([]);
    },
  };

  return (
    <>
      <Modal
        centered
        title={<span style={{ color: "#252525" }}>Adicionar novo arquivo</span>}
        open={showModal}
        onCancel={handleClose}
        footer={null}
        width={600}
      >
        <ConfigProvider
          theme={{
            components: {
              Input: {
                hoverBorderColor: "#0026d9",
                activeBorderColor: "#0026d9",
                activeShadow: "none",
                colorBorder: "#bfbfbf",
                colorTextPlaceholder: "#666666",
              },
              Button: {
                colorBorder: "#0026d9",
                colorText: "#0026d9",
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
              },
              Upload: {
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#0026d9",
              },
            },
          }}
        >
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} style={{ width: "100%" }} className={blueOutlineButtonClass}>
                  Selecionar arquivo
                </Button>
              </Upload>
              <p className="mt-2 text-[12px] text-neutral-500">
                * Formatos aceitos: .xlsx ou .pdf
              </p>
            </div>

            <div>
              <label className="block mb-2 text-[14px] font-medium text-[#252525]">
                Descrição
              </label>
              <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 3 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 text-[16px] font-light text-[#353535] w-full"
                placeholder="Adicione aqui uma descrição..."
              />
            </div>
          </div>

          <div
            className="flex justify-end gap-4 z-10"
            style={{
              position: "sticky",
              bottom: -1,
              left: 0,
              right: 0,
              paddingTop: "16px",
              paddingBottom: "8px",
            }}
          >
            <Button
              className={blueOutlineButtonClass}
              onClick={handleClose}
              style={{
                fontSize: "14px",
              }}
              disabled={isUploadPending}
            >
              Cancelar
            </Button>
            <Button
              className={blueOutlineButtonClass}
              onClick={handleSave}
              style={{
                fontSize: "14px",
              }}
              loading={isUploadPending}
            >
              Enviar
            </Button>
          </div>
        </ConfigProvider>
      </Modal>
    </>
  );
}
