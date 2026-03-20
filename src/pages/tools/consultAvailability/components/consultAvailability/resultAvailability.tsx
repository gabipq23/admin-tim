import { capitalizeWords } from "@/utils/capitaliWords";
import { formatCEP } from "@/utils/formatCEP";
import { Button, ConfigProvider } from "antd";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DisplayGenerator from "@/components/displayGenerator";
import OperatorAvailability from "@/components/operatorAvailability";

export default function ResultAvailability() {
  const location = useLocation();
  const data = location.state;
  const navigate = useNavigate();
  const params = useParams();
  const numeroFromUrl = params.numero;
  return (
    <>
      <div className="px-6 md:px-10 lg:px-14 flex flex-col gap-2">
        <div className="flex  gap-8 justify-between mt-6 mb-2">
          <h1 className="text-[22px]  pl-16">Resultado de Disponibilidade</h1>
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  hoverBorderColor: "#8b8e8f",
                  activeBorderColor: "#8b8e8f",
                  activeShadow: "none",
                },
                Select: {
                  hoverBorderColor: "#8b8e8f",
                  activeBorderColor: "#8b8e8f",
                  activeOutlineColor: "none",
                },
                DatePicker: {
                  hoverBorderColor: "#8b8e8f",
                  activeBorderColor: "#8b8e8f",
                  colorPrimaryBorder: "#8b8e8f",
                  colorPrimary: "#8b8e8f",
                },
                Button: {
                  colorBorder: "#8b8e8f",
                  colorText: "#8b8e8f",
                  colorPrimary: "#8b8e8f",
                  colorPrimaryHover: "#a3a3a3",
                },
              },
            }}
          >
            <div className=" self-end">
              <Button
                type="default"
                variant="solid"
                className=""
                onClick={() => {
                  navigate("/admin/consulta-disponibilidade");
                }}
              >
                <ArrowLeft size={14} />
                <span>Voltar para consulta</span>
              </Button>
            </div>
          </ConfigProvider>
        </div>

        {/* Seção de Disponibilidade */}
        <div className="flex flex-col gap-2 bg-white mb-3 rounded-[4px] border-1 border-neutral-200 w-full p-3 ">
          {/* Tabela de Disponibilidade */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Header com logos */}
              <thead>
                <tr>
                  <td className="w-24"></td>{" "}
                  {/* Coluna vazia para os labels laterais */}
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      src="/assets/vivo.png"
                      alt="Vivo"
                      className="max-h-6 mx-auto"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-8 w-8 mx-auto"
                      src="/assets/claro.png"
                      alt="Claro"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-7 w-14 mx-auto"
                      src="/assets/tim.svg"
                      alt="TIM"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-8=9 w-9 mx-auto"
                      src="/assets/oi.svg"
                      alt="OI"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-5 mx-auto"
                      src="/assets/sky.svg"
                      alt="Sky"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-4 mx-auto"
                      src="/assets/nio.svg"
                      alt="NIO"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-5 mx-auto"
                      src="/assets/algar.png"
                      alt="Algar"
                    />
                  </td>
                  <td className="text-center p-2 border-b border-gray-200">
                    <img
                      className="h-4 mx-auto"
                      src="/assets/brisanet.png"
                      alt="Brisanet"
                    />
                  </td>
                </tr>
              </thead>
              <tbody>
                {/* Linha 1: Disponibilidade */}
                <tr>
                  <td className="text-[12px] font-medium text-gray-600 p-2 pr-4">
                    Disponibilidade
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="Vivo"
                      operatorData={{
                        availability: data.availability,
                        encontrado_via_range: data.encontrado_via_range,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="Claro"
                      operatorData={{
                        availability: data.availability_claro,
                        encontrado_via_range: data.encontrado_via_range_claro,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="TIM"
                      operatorData={{
                        availability: data.availability_tim,
                        encontrado_via_range: data.encontrado_via_range_tim,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="OI"
                      operatorData={{
                        availability: data.availability_oi,
                        encontrado_via_range: data.encontrado_via_range_oi,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="Sky"
                      operatorData={{
                        availability: data.availability_sky,
                        encontrado_via_range: data.encontrado_via_range_sky,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="NIO"
                      operatorData={{
                        availability: data.availability_nio,
                        encontrado_via_range: data.encontrado_via_range_nio,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="ALGAR"
                      operatorData={{
                        availability: data.availability_algar,
                        encontrado_via_range: data.encontrado_via_range_algar,
                      }}
                    />
                  </td>
                  <td className="text-center p-2">
                    <OperatorAvailability
                      operatorName="BRISANET"
                      operatorData={{
                        availability: data.availability_brisanet,
                        encontrado_via_range: data.encontrado_via_range_brisanet,
                      }}
                    />
                  </td>
                </tr>

                {/* Linha 2: Range de números */}
                {(data.encontrado_via_range ||
                  data.encontrado_via_range_claro ||
                  data.encontrado_via_range_tim ||
                  data.encontrado_via_range_oi ||
                  data.encontrado_via_range_sky ||
                  data.encontrado_via_range_nio ||
                  data.encontrado_via_range_algar ||
                  data.encontrado_via_range_brisanet) && (
                    <tr>
                      <td className="text-[12px] w-30 font-medium text-gray-600 p-2 pr-4">
                        Range numérico
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability && data.encontrado_via_range
                          ? `${data.range_min} - ${data.range_max}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_claro &&
                          data.encontrado_via_range_claro
                          ? `${data.range_min_claro} - ${data.range_max_claro}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_tim && data.encontrado_via_range_tim
                          ? `${data.range_min_tim} - ${data.range_max_tim}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_oi && data.encontrado_via_range_oi
                          ? `${data.range_min_oi} - ${data.range_max_oi}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_sky && data.encontrado_via_range_sky
                          ? `${data.range_min_sky} - ${data.range_max_sky}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_nio && data.encontrado_via_range_nio
                          ? `${data.range_min_nio} - ${data.range_max_nio}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_algar && data.encontrado_via_range_algar
                          ? `${data.range_min_algar} - ${data.range_max_algar}`
                          : "-"}
                      </td>
                      <td className="text-center p-2 text-[11px] ">
                        {data.availability_brisanet && data.encontrado_via_range_brisanet
                          ? `${data.range_min_brisanet} - ${data.range_max_brisanet}`
                          : "-"}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {data.disponibilidade === true && (
          <div className="text-[14px] bg-white p-4 gap-2 rounded-[4px] border-1 border-neutral-200 w-full ">
            <div className=" flex items-center mb-3">
              <h2 className=" text-[16px] font-semibold">Detalhamento Vivo</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 ">
              <DisplayGenerator
                title="Armário:"
                value={capitalizeWords(data.dados.ARMARIO)}
              />
              <DisplayGenerator
                title="Tipo:"
                value={capitalizeWords(data.dados.TIPO)}
              />
              <DisplayGenerator
                title="CEP:"
                value={formatCEP(data.dados.CEP)}
              />
              <DisplayGenerator
                title="Logradouro:"
                value={capitalizeWords(data.dados.LOGRADOURO)}
                maxLength={30}
              />
              <DisplayGenerator
                title="Número:"
                value={
                  data.dados.NUM === numeroFromUrl
                    ? capitalizeWords(data.dados.NUM)
                    : `Dentro do range de ${data.range_min}/${data.range_max}`
                }
              />
              <DisplayGenerator
                title="Bairro:"
                value={capitalizeWords(data.dados.BAIRRO)}
                maxLength={25}
              />
              <DisplayGenerator
                title="Cidade:"
                value={capitalizeWords(data.dados.CIDADE)}
              />
              <DisplayGenerator
                title="Território:"
                value={capitalizeWords(data.dados.TERRITORIO)}
                maxLength={30}
              />
              <DisplayGenerator title="UF:" value={data.dados.UF} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
