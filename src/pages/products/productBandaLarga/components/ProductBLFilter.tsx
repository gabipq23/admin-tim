import { Button, Tooltip, ConfigProvider, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import {
    Control,
    Controller,
    UseFormHandleSubmit,
} from "react-hook-form";
import { useState } from "react";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import CreateProductBL from "../modals/CreateProductBL";
import type { ProductBLFiltersFormValues } from "../controllers/filters";
import type { CreatedProductResponse } from "@/services/products";

type ProductCreatePayload = FormData;
type UploadConditionsPayload = { id: number; files: File[] };

interface FiltroProductBLFormProps {
    control: Control<ProductBLFiltersFormValues>;
    handleSubmit: UseFormHandleSubmit<ProductBLFiltersFormValues>;
    onSubmit: (data: ProductBLFiltersFormValues) => void;
    onClear: () => void;
    isFiltered: boolean;
    createProductBL: (data: ProductCreatePayload) => Promise<CreatedProductResponse>;
    uploadProductConditionsBL: (data: UploadConditionsPayload) => Promise<unknown>;
}

export function FilterProductBL({
    control,
    handleSubmit,
    onSubmit,
    onClear,
    createProductBL,
    uploadProductConditionsBL,
}: FiltroProductBLFormProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                onReset={onClear}
                className="flex min-w-[200px] flex-wrap  gap-2 mb-4"
            >
                <div className="flex gap-2 flex-wrap">
                    <ConfigProvider
                        theme={{
                            components: {
                                Input: {
                                    hoverBorderColor: "#0026d9",
                                    activeBorderColor: "#0026d9",
                                    activeShadow: "none",
                                },
                                Select: {
                                    hoverBorderColor: "#0026d9",
                                    activeBorderColor: "#0026d9",
                                    activeOutlineColor: "none",
                                },
                            },
                        }}
                    >
                        <Controller
                            control={control}
                            name="client_type"
                            render={({ field }) => (
                                <Select
                                    style={{
                                        width: "90px",
                                    }}
                                    placeholder="Tipo"
                                    value={field.value || undefined}
                                    onChange={field.onChange}
                                    options={[
                                        { value: "PF", label: "PF" },
                                        { value: "PJ", label: "PJ" },
                                    ]}
                                    allowClear
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name="online"
                            render={({ field }) => (
                                <Select
                                    style={{
                                        width: "90px",
                                    }}
                                    placeholder="Status"
                                    value={field.value === null ? undefined : String(field.value)}
                                    onChange={(value) => {
                                        if (value === "true") {
                                            field.onChange(true);
                                            return;
                                        }

                                        if (value === "false") {
                                            field.onChange(false);
                                            return;
                                        }

                                        field.onChange(null);
                                    }}
                                    options={[
                                        { value: "true", label: "Online" },
                                        { value: "false", label: "Offline" },
                                    ]}
                                    allowClear
                                />
                            )}
                        />

                        {/* <Controller
              control={control}
              name="minPrice"
              render={({ field }) => (
                <InputNumber
                  style={{ width: "148px" }}
                  min={0}
                  placeholder="Valor Min."
                  value={field.value}
                  onChange={field.onChange}
                  formatter={(value) =>
                    value === undefined || value === null || value === ""
                      ? ""
                      : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value ? value.replace(/[R$\s.]/g, "").replace(",", ".") : ""
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="maxPrice"
              render={({ field }) => (
                <InputNumber
                  style={{ width: "148px" }}
                  min={0}
                  placeholder="Valor Max."
                  value={field.value}
                  onChange={field.onChange}
                  formatter={(value) =>
                    value === undefined || value === null || value === ""
                      ? ""
                      : `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value ? value.replace(/[R$\s.]/g, "").replace(",", ".") : ""
                  }
                />
              )}
            /> */}
                    </ConfigProvider>
                </div>

                <div className="flex gap-2 items-center">
                    <Tooltip
                        title="Filtrar"
                        placement="top"
                        styles={{ body: { fontSize: "11px" } }}
                    >
                        <Button
                            className={blueOutlineButtonClass}
                            style={{
                                width: "24px",
                                height: "28px",

                            }}
                            htmlType="submit"
                        >
                            <FilterOutlined />
                        </Button>
                    </Tooltip>

                    <Tooltip
                        title="Limpar filtro"
                        placement="top"
                        styles={{ body: { fontSize: "11px" } }}
                    >
                        <Button
                            onClick={onClear}
                            className={blueOutlineButtonClass}
                            style={{
                                width: "24px",
                                height: "28px",

                            }}
                        >
                            X
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title="Adicionar Plano"
                        placement="top"
                        styles={{ body: { fontSize: "11px" } }}
                    >
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className={blueOutlineButtonClass}
                            style={{
                                width: "24px",
                                height: "28px",

                            }}
                        >
                            +
                        </Button>
                    </Tooltip>
                </div>
            </form>
            <CreateProductBL
                createProductBL={createProductBL}
                uploadProductConditionsBL={uploadProductConditionsBL}
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
            />
        </>
    );
}