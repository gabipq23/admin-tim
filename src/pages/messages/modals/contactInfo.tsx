import { IContact } from "@/interfaces/contacts";

import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { CopyOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Modal, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";

export function ContactInfoModal({
  isModalOpen,
  closeModal,
  selectedId,
  changeContactStatus,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  selectedId: IContact | null;
  changeContactStatus?: any;
}) {
  const getTimeOrDate = (dataEpoch: string, type: "hora" | "data") => {
    const match = dataEpoch.match(/^(\d{2})-(\d{2})-(\d{4}) (.+)$/);
    let formattedDate = dataEpoch;
    if (match) {
      formattedDate = `${match[3]}-${match[2]}-${match[1]} ${match[4]}`;
    }

    const converted = (formattedDate);
    if (type === "hora") {
      return converted.split(",")[1].trim().slice(0, 5);
    }
    if (type === "data") {
      const [month, day, year] = converted.split(",")[0].split("/");
      return `${day}/${month}/${year}`;
    }
  };

  const [tooltipTitle, setTooltipTitle] = useState("Copiar");

  const handleCopy = (
    code: string,
    setTooltip: React.Dispatch<React.SetStateAction<string>>
  ) => {
    navigator.clipboard.writeText(code || "-");
    setTooltip("Copiado!");
    setTimeout(() => setTooltip("Copiar"), 2000);
  };
  const [localStatus, setLocalStatus] = useState(
    selectedId?.status_message ?? ""
  );

  useEffect(() => {
    setLocalStatus(selectedId?.status_message ?? "");
  }, [selectedId?.status_message]);

  const copyComponent = (text: string) => {
    return (
      <Tooltip
        styles={{ body: { fontSize: "11px" } }}
        title={tooltipTitle}
        trigger="hover"
        placement="top"
      >
        <div
          onClick={() => selectedId && handleCopy(text, setTooltipTitle)}
          className="text-[#666666] cursor-pointer"
        >
          <CopyOutlined style={{ fontSize: 16, color: "geekblue" }} />
        </div>
      </Tooltip>
    );
  };

  return (
    <Modal
      centered
      title={
        <div className="flex  justify-between">
          <span style={{ color: "#252525" }}>#{selectedId?.id}</span>

          <ConfigProvider
            theme={{
              components: {
                Select: {
                  hoverBorderColor: "#0026d9",
                  activeBorderColor: "#0026d9",
                  activeOutlineColor: "none",
                },
              },
            }}
          >
            <div className="flex items-center gap-2 mr-5">
              <span className="text-[14px] font-semibold">Status: </span>
              <Select
                size="small"
                value={localStatus}
                style={{ width: "150px", fontWeight: "400" }}
                onChange={(value) => {
                  setLocalStatus(value);

                  if (selectedId?.id) {
                    changeContactStatus({
                      id: selectedId.id,
                      status_mensagem: value,
                    });
                  }
                }}
                options={[
                  { label: "Visualizada", value: "LIDA" },
                  { label: "Respondida", value: "RESPONDIDA" },
                ]}
              />
            </div>
          </ConfigProvider>
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      width={1000}
    >
      <div className="flex flex-col mr-4">
        <p className="flex text-[22px] gap-2 ">
          {selectedId?.subject} {copyComponent(selectedId?.subject ?? "")}
        </p>
        <div className="flex ">
          <div className="flex flex-col md:flex-row lg:flex-row w-full justify-between text-[#666666]">
            <p className="flex gap-2 text-[15px]">
              {selectedId?.name} {copyComponent(selectedId?.name ?? "")} &bull;{" "}
              {formatPhoneNumber(selectedId?.phone ?? "")} &bull;{" "}
              {formatCNPJ(selectedId?.cnpj ?? "")} &bull; {selectedId?.email}{" "}
              {copyComponent(selectedId?.email ?? "")}{" "}
            </p>
            <div className="flex gap-2">
              {selectedId?.created_at && (
                <p>
                  {getTimeOrDate(selectedId?.created_at, "data")},{" "}
                  {getTimeOrDate(selectedId?.created_at, "hora")}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#eeeeee] mt-8 p-1 text-[15px] text-[#666666]">
          Mensagem
          {selectedId?.company ? (
            <>
              {" da empresa"}{" "}
              {<span className="text-[#555]">{selectedId?.company}</span>}:
            </>
          ) : (
            ":"
          )}
        </div>
        <div className="flex items-center border-1 p-1 border-[#eeeeee] text-[16px] text-[#666666] justify-between">
          <span>{selectedId?.message}</span>
          {copyComponent(selectedId?.message ?? "")}
        </div>
      </div>

      <div className="mt-4 flex gap-4 justify-end mr-4">
        <Button
          onClick={closeModal}
          className={blueOutlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          Fechar
        </Button>
      </div>
    </Modal>
  );
}
