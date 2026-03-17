
import { capitalizeWords } from "@/utils/capitaliWords";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import { Button, Modal } from "antd";
import { ICompany } from "@/interfaces/consult";

export function ClientInfoModal({
  isModalOpen,
  closeModal,
  selectedClient,
}: {
  isModalOpen: boolean;
  selectedClient: ICompany | null;
  closeModal: () => void;
}) {

  return (
    <Modal
      centered
      title={
        <div className="flex  justify-between">
          <span style={{ color: "#252525" }}>
            {selectedClient?.company_legal_name === "#NAME?"
              ? formatCNPJ(selectedClient?.cnpj || "")
              : capitalizeWords(
                selectedClient?.company_legal_name || ""
              )}
          </span>
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      width={1000}
    >
      <div className="flex items-center  justify-center gap-2  max-h-[500px] overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-3 text-[14px] py-3  w-full h-[460px] ">
          {/* Informações do usuario */}
          <div className="flex flex-col  gap-2 bg-neutral-100 mb-3 rounded-[4px] p-3  w-full">
            <div className=" flex items-center">
              <h2 className=" text-[14px] font-semibold">Dados da empresa</h2>
            </div>

            <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
              <div className="text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Razão Social:</strong>{" "}
                  {selectedClient?.company_legal_name === "#NAME?"
                    ? "-"
                    : capitalizeWords(
                      selectedClient?.company_legal_name || ""
                    ) || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2  text-[14px] w-full text-neutral-700">
                <p>
                  <strong>CNPJ: </strong>
                  {formatCNPJ(selectedClient?.cnpj || "") || "-"}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-2   text-[14px] w-full text-neutral-700">
                <p>
                  <strong>MEI :</strong>{" "}
                  {selectedClient?.is_mei ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Status RFB :</strong>{" "}
                  {selectedClient?.rfb_status === "ATIVA"
                    ? "Ativa"
                    : selectedClient?.rfb_status === "INAPTA"
                      ? "Inapta"
                      : selectedClient?.rfb_status === "SUSPENSA"
                        ? "Suspensa"
                        : selectedClient?.rfb_status === "BAIXADA"
                          ? "Baixada"
                          : "-"}
                </p>
              </div>

              {/* <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700"> */}
              {/* <p>
                  <strong>Email: </strong> {selectedClient?.email || "-"}
                </p>
                <p>
                  <strong>Telefone:</strong>{" "}
                  {formatPhoneNumber(selectedClient?.phone || "") ||
                    "-"}
                </p>
              </div> */}
              {/* <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>CNAE: </strong> {selectedClient?.cnae_fiscal || "-"}
                </p>
              </div> */}
              <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Endereço:</strong>{" "}
                  {capitalizeWords(
                    selectedClient?.address || ""
                  ) || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Número fachada: </strong>{" "}
                  {selectedClient?.address_number || "-"}
                </p>
                <p>
                  <strong>Complemento: </strong>{" "}
                  {capitalizeWords(selectedClient?.address_complement || "") || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Cidade: </strong>{" "}
                  {capitalizeWords(selectedClient?.city || "") || "-"}
                </p>
                <p>
                  <strong>UF: </strong> {selectedClient?.state || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Bairro: </strong>{" "}
                  {capitalizeWords(selectedClient?.district || "") || "-"}
                </p>
                <p>
                  <strong>CEP: </strong> {selectedClient?.zip_code || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-[14px] py-3 bg-neutral-100 mb-3 rounded-[4px] p-3  gap-2 w-full">
            <div className=" flex items-center">
              <h2 className="p-4 text-[14px] font-semibold">Dados do Gestor</h2>
            </div>
            <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[80px] p-4">
              <div className="grid grid-cols-2 gap-2  text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Nome: </strong>
                  {capitalizeWords(selectedClient?.full_name || "") || "-"}
                </p>
                <p>
                  <strong>Email: </strong>
                  {selectedClient?.email || "-"}
                </p>
                <p>
                  <strong>Telefone: </strong>
                  {formatPhoneNumber(selectedClient?.phone || "") ||
                    "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-[14px] py-3 bg-neutral-100 mb-3 rounded-[4px] p-3  gap-2 w-full">
            <div className=" flex items-center">
              <h2 className="p-4 text-[14px] font-semibold">
                Dados de Crédito
              </h2>
            </div>
            <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[60px] p-4">
              {/* Mobile: CNPJ e Razão Social em coluna */}
              <div className=" grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Crédito aparelhos: </strong>
                  R${" "}
                  {(selectedClient?.credit || 0)
                    .toFixed(2)
                    .replace(".", ",") || "-"}
                </p>




              </div>
            </div>
          </div>

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
