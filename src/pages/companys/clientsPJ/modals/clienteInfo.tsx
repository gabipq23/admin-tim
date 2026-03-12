import { ICompany } from "@/interfaces/consult";
import { capitalizeWords } from "@/utils/capitaliWords";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import { Button, Modal } from "antd";

export function ClientInfoModal({
  isModalOpen,
  closeModal,
  selectedClient,
}: {
  isModalOpen: boolean;
  selectedClient: ICompany | null;
  closeModal: () => void;
}) {
  const cleanPhone = (tel: string) =>
    tel.startsWith("55") ? tel.slice(2) : tel;

  return (
    <Modal
      centered
      title={
        <div className="flex  justify-between">
          <span style={{ color: "#252525" }}>
            {selectedClient?.credito_cliente?.razao_social === "#NAME?"
              ? formatCNPJ(selectedClient?.nr_cnpj)
              : capitalizeWords(
                selectedClient?.credito_cliente?.razao_social || ""
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
                  {selectedClient?.credito_cliente?.razao_social === "#NAME?"
                    ? "-"
                    : capitalizeWords(
                      selectedClient?.credito_cliente?.razao_social || ""
                    ) || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2  text-[14px] w-full text-neutral-700">
                <p>
                  <strong>CNPJ: </strong>
                  {formatCNPJ(selectedClient?.nr_cnpj || "") || "-"}
                </p>
                <p>
                  <strong>Porte:</strong>{" "}
                  {selectedClient?.porte === "MICRO EMPRESA"
                    ? "Micro Empresa"
                    : selectedClient?.porte === "EMPRESA DE PEQUENO PORTE"
                      ? "Pequeno Porte"
                      : selectedClient?.porte === "DEMAIS"
                        ? "Demais"
                        : "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2   text-[14px] w-full text-neutral-700">
                <p>
                  <strong>MEI :</strong>{" "}
                  {selectedClient?.opcao_pelo_mei ? "Sim" : "Não"}
                </p>
                <p>
                  <strong>Status RFB :</strong>{" "}
                  {selectedClient?.situacao_cadastral === "ATIVA"
                    ? "Ativa"
                    : selectedClient?.situacao_cadastral === "INAPTA"
                      ? "Inapta"
                      : selectedClient?.situacao_cadastral === "SUSPENSA"
                        ? "Suspensa"
                        : selectedClient?.situacao_cadastral === "BAIXADA"
                          ? "Baixada"
                          : "-"}
                </p>
              </div>

              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Email: </strong> {selectedClient?.email_gestor || "-"}
                </p>
                <p>
                  <strong>Telefone:</strong>{" "}
                  {formatPhoneNumber(selectedClient?.telefone_gestor || "") ||
                    "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>CNAE: </strong> {selectedClient?.cnae_fiscal || "-"}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Endereço:</strong>{" "}
                  {capitalizeWords(
                    selectedClient?.credito_cliente?.endereco || ""
                  ) || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Número fachada: </strong>{" "}
                  {selectedClient?.numero_fachada || "-"}
                </p>
                <p>
                  <strong>Complemento: </strong>{" "}
                  {capitalizeWords(selectedClient?.complemento || "") || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Cidade: </strong>{" "}
                  {capitalizeWords(selectedClient?.cidade || "") || "-"}
                </p>
                <p>
                  <strong>UF: </strong> {selectedClient?.uf || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2  gap-2 text-[14px] w-full text-neutral-700">
                <p>
                  <strong>Bairro: </strong>{" "}
                  {capitalizeWords(selectedClient?.bairro || "") || "-"}
                </p>
                <p>
                  <strong>CEP: </strong> {selectedClient?.nr_cep || "-"}
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
                  {capitalizeWords(selectedClient?.nome_gestor || "") || "-"}
                </p>
                <p>
                  <strong>Email: </strong>
                  {selectedClient?.email_gestor || "-"}
                </p>
                <p>
                  <strong>Telefone: </strong>
                  {formatPhoneNumber(selectedClient?.telefone_gestor || "") ||
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
                  {(selectedClient?.credito_cliente?.credito || 0)
                    .toFixed(2)
                    .replace(".", ",") || "-"}
                </p>
                <p>
                  <strong>Crédito equipamento: </strong> R${" "}
                  {(
                    Number(
                      selectedClient?.credito_cliente?.credito_equipamentos
                    ) || 0
                  )
                    .toFixed(2)
                    .replace(".", ",") || "-"}
                </p>

                {selectedClient?.credito_cliente?.telefones?.map(
                  (telefoneObj, index) => (
                    <div className="flex flex-col gap-1" key={index}>
                      <p key={index}>
                        <strong>Telefone : </strong>
                        {formatPhoneNumber(cleanPhone(telefoneObj.telefone)) ||
                          "-"}{" "}
                        &bull; <strong>M Vivo: </strong> {telefoneObj.M || "-"}
                      </p>
                    </div>
                  )
                )}
                <p>
                  <strong>Total de linhas: </strong>{" "}
                  {selectedClient?.credito_cliente?.telefones?.length || 0}
                </p>
                <p>
                  <strong>
                    Quantidade de linhas viáveis para novo aparelho:{" "}
                  </strong>{" "}
                  {selectedClient?.credito_cliente?.telefones?.filter(
                    (telefone) => telefone.M > 3
                  ).length || 0}
                </p>
              </div>
            </div>
          </div>
          {Array.isArray(selectedClient?.marcas_modelos) &&
            selectedClient.marcas_modelos.length > 0 && (
              <div className="flex flex-col text-[14px] py-3 bg-neutral-100 mb-3 rounded-[4px] p-3  gap-2 w-full">
                <div className=" flex items-center">
                  <h2 className="p-4 text-[14px] font-semibold">
                    Dados de Aparelhos
                  </h2>
                </div>
                <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[60px] p-4">
                  <div className=" grid grid-cols-1 gap-2 text-[14px] w-full text-neutral-700">
                    {selectedClient.marcas_modelos.map((item, index) => (
                      <div className="flex gap-1" key={index}>
                        <p>
                          <strong>Marca:</strong> {item.marca || "-"}
                        </p>{" "}
                        &bull;
                        <p>
                          <strong>Modelo: </strong>
                          {item.modelo || "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
