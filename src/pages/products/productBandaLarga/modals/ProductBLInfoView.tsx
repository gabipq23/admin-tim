import {
    Divider,
    Button,
} from "antd";
import {
    DownloadOutlined,
    WifiOutlined,
} from "@ant-design/icons";
import {
    IProduct,
    ProductDetail,
    ProductExtraGroup,
    ProductOfferConditionFile,
} from "@/interfaces/products";
import { blueOutlineButtonClass } from "@/utils/buttonStyles";
import { formatBRL } from "@/utils/formatBRL";

interface ProductBLInfoViewProps {
    planData: IProduct;
    setShowEditProductLayout: (value: boolean) => void;
    setShowDeleteModal: (value: boolean) => void;
}

export default function ProductBLInfoView({
    planData,
    setShowEditProductLayout,
    setShowDeleteModal,
}: ProductBLInfoViewProps) {
    return (
        <>
            <>
                <div className="max-h-[520px] overflow-y-auto scrollbar-thin">
                    {/* Header do Plano */}
                    <div className="bg-neutral-100 p-6 rounded-lg mb-6">
                        {planData.badge && (
                            <div className="mb-2">
                                <span className="font-semibold text-gray-700">
                                    {planData.badge}
                                </span>
                            </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {planData.name} - {planData.client_type}
                                </h2>
                            </div>
                        </div>

                        {(planData.offer_title || planData.offer_subtitle) && (
                            <div className="mb-4">
                                {planData.offer_title && (
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-1">
                                        <WifiOutlined className="text-blue-500" />
                                        {planData.offer_title}
                                    </h3>
                                )}
                                {planData.offer_subtitle && (
                                    <p className="text-sm text-gray-600">
                                        {planData.offer_subtitle}
                                    </p>
                                )}
                            </div>
                        )}

                        {planData.offer_conditions &&
                            planData.offer_conditions.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {planData.offer_conditions.map((
                                            condition: ProductOfferConditionFile | string,
                                            idx: number,
                                        ) => {
                                            const conditionUrl =
                                                typeof condition === "string"
                                                    ? condition
                                                    : condition?.url;
                                            if (!conditionUrl) return null;

                                            return (
                                                <a
                                                    style={{ color: "#0026d9" }}
                                                    key={idx}
                                                    href={conditionUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={`arquivo_${idx + 1}`}
                                                    className="text-blue-600 underline text-xs"
                                                >
                                                    <DownloadOutlined /> arquivo {idx + 1}
                                                    {typeof condition !== "string" && condition?.type
                                                        ? ` (${condition.type})`
                                                        : ""}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Preços */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-6 items-center justify-start">
                        <div className="flex flex-col items-center md:items-start flex-1">
                            <div className="text-sm text-gray-500 mb-1">
                                Mensalidade
                            </div>
                            <div className="text-3xl font-bold text-neutral-700 flex items-end">
                                {formatBRL(planData.pricing?.base_monthly || 0)}
                                <span className="text-sm text-gray-500 ml-2 mb-1">
                                    /mês
                                </span>
                            </div>
                        </div>
                        {typeof planData.pricing?.installation === "number" && (
                            <div className="flex flex-col items-center md:items-start flex-1">
                                <div className="text-sm text-gray-500 mb-1">
                                    Instalação
                                </div>
                                <div className="text-2xl font-bold text-neutral-700 flex items-end">
                                    {formatBRL(planData.pricing.installation)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Detalhes do Plano */}
                    {planData.details && planData.details.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Características do Plano
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {planData.details.map((detail: ProductDetail, index: number) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-800 flex-1">
                                                {detail.title}
                                            </h4>
                                            <div className="flex flex-col gap-1 ml-2">
                                                {detail.highlight_top && (
                                                    <p className="text-[10px] text-center rounded bg-[#0026d9] text-white px-2 py-1">
                                                        Compacto
                                                    </p>
                                                )}
                                                {detail.highlight_bottom && (
                                                    <p className="text-[10px] text-center rounded bg-[#0026d9] text-white px-2 py-1">
                                                        Destaque
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3">
                                            {detail.description}
                                        </p>

                                        {Array.isArray(detail.images) &&
                                            detail.images.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {detail.images.map((imgUrl: string, idx: number) => (
                                                        <a
                                                            style={{ color: "#0026d9" }}
                                                            key={idx}
                                                            href={imgUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={`imagem_${idx + 1}.jpg`}
                                                            className="text-xs underline"
                                                        >
                                                            <DownloadOutlined /> imagem {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Extras */}
                    {(planData.extras?.client?.length > 0 ||
                        planData.extras?.non_client?.length > 0) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Extras
                                </h3>

                                <div className="space-y-6">
                                    {planData.extras.client?.length > 0 && (
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-3 text-base">
                                                Cliente
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {planData.extras.client.map(
                                                    (group: ProductExtraGroup, idx: number) => (
                                                        <div
                                                            key={`${group.id}-${idx}`}
                                                            className="bg-white border border-gray-200 rounded-lg p-4"
                                                        >
                                                            <div className="font-semibold text-gray-800 mb-2">
                                                                {group.label}
                                                            </div>
                                                            <div className="text-xs text-gray-500 uppercase mb-3">
                                                                {group.input_type}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {group.options.map((option, optionIdx) => (
                                                                    <div
                                                                        key={`${option.id}-${optionIdx}`}
                                                                        className="flex items-center justify-between border border-gray-100 rounded px-3 py-2"
                                                                    >
                                                                        <div>
                                                                            <div className="text-gray-800 text-sm">
                                                                                {option.label}
                                                                            </div>
                                                                            {option.description && (
                                                                                <div className="text-xs text-gray-500">
                                                                                    {option.description}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm font-semibold text-gray-700">
                                                                            {option.price > 0
                                                                                ? formatBRL(option.price)
                                                                                : "-"}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {planData.extras.non_client?.length > 0 && (
                                        <div>
                                            <div className="font-semibold text-gray-800 mb-3 text-base">
                                                Não Cliente
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {planData.extras.non_client.map(
                                                    (group: ProductExtraGroup, idx: number) => (
                                                        <div
                                                            key={`${group.id}-${idx}`}
                                                            className="bg-white border border-gray-200 rounded-lg p-4"
                                                        >
                                                            <div className="font-semibold text-gray-800 mb-2">
                                                                {group.label}
                                                            </div>
                                                            <div className="text-xs text-gray-500 uppercase mb-3">
                                                                {group.input_type}
                                                            </div>
                                                            <div className="space-y-2">
                                                                {group.options.map((option, optionIdx) => (
                                                                    <div
                                                                        key={`${option.id}-${optionIdx}`}
                                                                        className="flex items-center justify-between border border-gray-100 rounded px-3 py-2"
                                                                    >
                                                                        <div>
                                                                            <div className="text-gray-800 text-sm">
                                                                                {option.label}
                                                                            </div>
                                                                            {option.description && (
                                                                                <div className="text-xs text-gray-500">
                                                                                    {option.description}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-sm font-semibold text-gray-700">
                                                                            {option.price > 0
                                                                                ? formatBRL(option.price)
                                                                                : "-"}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    <Divider />

                    {/* Ações */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            className={blueOutlineButtonClass}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Excluir Plano
                        </Button>
                        <Button
                            className={blueOutlineButtonClass}
                            onClick={() => setShowEditProductLayout(true)}
                        >
                            Editar Plano
                        </Button>
                    </div>
                </div>
            </>
        </>
    );
}