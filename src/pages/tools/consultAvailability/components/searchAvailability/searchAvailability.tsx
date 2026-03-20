import { SearchOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Select } from "antd";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  useGetAllBairrosController,
  useGetAllCidadesController,
  useSearchAvailabilityController,
} from "../../controller/searchAvailabilityController";
import { brasilStates } from "../../brasilStates";
import { capitalizeText } from "@/utils/capitalizeText";

export default function SearchAvailability() {
  const [form] = Form.useForm();
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [uf, setUf] = useState("");
  const [bairro, setBairro] = useState<string[]>([]);
  const [cidade, setCidade] = useState("");
  const [selectedUf, setSelectedUf] = useState("");
  const [selectedCidade, setSelectedCidade] = useState("");

  const { searchData, isSearchLoading } = useSearchAvailabilityController({
    cep,
    numero,
    limite: 100,
    uf,
    cidade,
    bairro,
    page: 1,
  });

  const { data: cidadesData, isLoading: isLoadingCidades } =
    useGetAllCidadesController(selectedUf);
  const { data: bairrosData, isLoading: isLoadingBairros } =
    useGetAllBairrosController(selectedUf, selectedCidade);

  const navigate = useNavigate();

  const cidadeOptions =
    cidadesData?.cidades?.map((cidade: string) => ({
      value: cidade,
      label: capitalizeText(cidade),
    })) || [];

  const bairroOptions =
    bairrosData?.bairros?.map((bairro: string) => ({
      value: bairro,
      label: capitalizeText(bairro),
    })) || [];

  const handleUfChange = (value: string) => {
    setSelectedUf(value);
    setSelectedCidade("");
    form.setFieldsValue({ cidade: undefined, bairro: undefined });
  };

  const handleCidadeChange = (value: string) => {
    setSelectedCidade(value);
    form.setFieldsValue({ bairro: undefined });
  };

  const handleSearchFinish = (values: {
    cep: string;
    numero: string;
    uf: string;
    cidade: string;
    bairro: string[];
  }) => {
    setCep(values.cep);
    setNumero(values.numero);
    setUf(values.uf);
    setCidade(values.cidade);
    setBairro(values.bairro);
  };

  useEffect(() => {
    if (uf && searchData) {
      const searchParams = new URLSearchParams();
      searchParams.set("uf", uf);
      if (cidade) searchParams.set("cidade", cidade);
      if (bairro && bairro.length > 0) {
        bairro.forEach((b) => searchParams.append("bairro", b));
      }
      if (cep) searchParams.set("cep", cep);
      if (numero) searchParams.set("numero", numero);

      navigate(`/admin/resultado-disponibilidade?${searchParams.toString()}`, {
        state: {
          uf,
          cidade,
          bairro,
          cep,
          numero,
          limite: 100,
          page: 1,
          ...searchData,
        },
      });
    }
  }, [searchData, uf, cidade, bairro, cep, numero, navigate]);

  return (
    <div className=" bg-neutral-50 rounded-xl p-4 w-full lg:w-2/4 mt-2 ">
      <div className="flex flex-col gap-2 justify-between  ">
        <h1 className="text-[22px] ">Buscar CEPs com disponibilidade</h1>
        <div className=" flex gap-1 items-center text-[14px]  text-neutral-500">
          <p>
            Verifique todos os CEPs que possuem disponibilidade de plano na
            região desejada.
          </p>
        </div>
      </div>

      <div className="w-full flex mt-3  gap-4 ">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                activeBorderColor: "#660099",
                hoverBorderColor: "#660099",
              },
              Select: {
                hoverBorderColor: "#660099",
                activeBorderColor: "#660099",
                activeOutlineColor: "none",
                optionSelectedBg: "#e6e6e6",
              },
            },
          }}
        >
          <Form
            className="w-full "
            form={form}
            layout="vertical"
            onFinish={handleSearchFinish}
          >
            <div className="flex gap-1">
              <Form.Item name="uf" rules={[]}>
                <Select
                  className="h-8 max-w-[80px]"
                  size="middle"
                  placeholder="UF"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={brasilStates}
                  onChange={handleUfChange}
                />
              </Form.Item>
              <Form.Item name="cidade" rules={[]}>
                <Select
                  className="h-8  min-w-[200px]"
                  size="middle"
                  placeholder="Selecione Cidade"
                  showSearch
                  loading={isLoadingCidades}
                  disabled={!selectedUf || isLoadingCidades}
                  filterOption={(input, option) =>
                    String(option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={cidadeOptions}
                  onChange={handleCidadeChange}
                />
              </Form.Item>
              <div className="flex">
                <Form.Item name="bairro" rules={[]}>
                  <Select
                    mode="multiple"
                    className=" min-w-[200px] min-h-8"
                    size="middle"
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    placeholder="Selecione Bairro"
                    showSearch
                    loading={isLoadingBairros}
                    disabled={!selectedCidade || isLoadingBairros}
                    filterOption={(input, option) =>
                      String(option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={bairroOptions}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSearchLoading}
                    style={{
                      backgroundColor: "#660099",
                      color: "white",
                      borderColor: "#000000",
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      height: "32px",
                    }}
                  >
                    <SearchOutlined />
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
}
