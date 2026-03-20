import { SearchOutlined } from "@ant-design/icons";
import { Button, ConfigProvider, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { useConsultAvailabilityController } from "../../controller/availabilityController";

const CEPInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="#####-###"
    customInput={Input}
    placeholder="CEP"
    size="middle"
  />
);
export default function ConsultAvailability() {
  const [form] = Form.useForm();
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");

  const { data, isLoading } = useConsultAvailabilityController(cep, numero);

  const navigate = useNavigate();

  const handleFinish = (values: { cep: string; numero?: string }) => {
    setCep(values.cep);
    setNumero(values.numero || "");
  };

  useEffect(() => {
    if (cep && data) {
      if (numero && numero !== "" && numero !== "S/N") {
        navigate(`/admin/consulta-disponibilidade/${cep}/${numero}`, {
          state: data,
        });
      } else {
        navigate(`/admin/consulta-disponibilidade/${cep}`, {
          state: data,
        });
      }
    }
  }, [data, cep, numero, navigate]);

  return (
    <div className=" bg-neutral-50 rounded-xl p-4 mt-4 w-full lg:w-2/4">
      <div className="flex flex-col gap-2 justify-between">
        <h1 className="text-[22px] ">Consulta de disponibilidade</h1>
        <div className=" flex gap-1 items-center text-[14px] text-neutral-500">
          <p>
            Verifique se o CEP e o número desejados possuem disponibilidade de
            plano.
          </p>
        </div>
      </div>

      <div className="w-64 flex mt-3 flex-col gap-4">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                activeBorderColor: "#660099",
                hoverBorderColor: "#660099",
              },
            },
          }}
        >
          <Form
            className="flex gap-1"
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            <Form.Item
              name="cep"
              rules={[
                { required: true, message: "Adicione um CEP" },
                {
                  pattern: /^\d{5}-\d{3}$/,
                  message: "CEP inválido",
                },
              ]}
            >
              <CEPInput format="######-###" />
            </Form.Item>
            <div className="flex">
              <Form.Item name="numero">
                <Input
                  className="h-8"
                  size="middle"
                  style={{
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                  placeholder="Número"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
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
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
}
