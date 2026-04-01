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
import { blueOutlineButtonClass, redOutlineButtonClass } from "@/utils/buttonStyles";
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
    const planUfs = Array.isArray(planData.uf) ? planData.uf : [];

    const monthlyCurrentPrice =
        typeof planData.pricing?.base_monthly === "number"
            ? planData.pricing.base_monthly
            : Number(planData.pricing?.base_monthly?.current_price ?? 0);

    const monthlyOriginalPrice =
        typeof planData.pricing?.base_monthly === "number"
            ? planData.pricing.base_monthly
            : planData.pricing?.base_monthly?.original_price;

    const installationCurrentPrice =
        typeof planData.pricing?.installation === "number"
            ? planData.pricing.installation
            : Number(planData.pricing?.installation?.current_price ?? 0);

    return (
        <>
            <div>
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
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500">Disponivel em:</span>
                                    {planUfs.length > 0 ? (
                                        planUfs.map((uf) => (
                                            <span
                                                key={uf}
                                                className="text-xs font-medium text-[#0026d9] bg-blue-50 border border-blue-100 px-2 py-1 rounded"
                                            >
                                                {uf}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs font-medium text-[#0026d9] bg-blue-50 border border-blue-100 px-2 py-1 rounded">
                                            Todas as UFs
                                        </span>
                                    )}
                                </div>
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
                                            const fileName = conditionUrl.split("/").pop() || `arquivo_${idx + 1}`;
                                            const ext = fileName.split(".").pop()?.toLowerCase();
                                            return (
                                                <a
                                                    style={{ color: "#0026d9" }}
                                                    key={idx}
                                                    href={conditionUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={fileName}
                                                    className="text-blue-600 underline text-xs flex items-center gap-1"
                                                >
                                                    <DownloadOutlined />
                                                    <span>{fileName}</span>
                                                    {typeof condition !== "string" && condition?.type
                                                        ? ` (${condition.type})`
                                                        : ext ? ` (${ext})` : ""}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Preços */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="text-sm text-gray-500 mb-1">
                                    Preço Inicial
                                </div>
                                <div className="text-2xl font-bold text-neutral-700 flex items-end">
                                    {monthlyOriginalPrice !== undefined ? formatBRL(monthlyOriginalPrice) : "-"}
                                </div>
                            </div>

                            <div className="flex flex-col items-center md:items-start">
                                <div className="text-sm text-gray-500 mb-1">
                                    Preço Atual
                                </div>
                                <div className="text-3xl font-bold text-neutral-700 flex items-end">
                                    {formatBRL(monthlyCurrentPrice)}
                                    <span className="text-sm text-gray-500 ml-2 mb-1">
                                        /mês
                                    </span>
                                </div>
                            </div>

                            {installationCurrentPrice >= 0 && (
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="text-sm text-gray-500 mb-1">
                                        Instalação
                                    </div>
                                    <div className="text-2xl font-bold text-neutral-700 flex items-end">
                                        {formatBRL(installationCurrentPrice)}
                                    </div>
                                </div>
                            )}
                        </div>
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
                                            <div className="flex flex-col gap-1 ml-2 w-14">
                                                {detail.highlight_top && (
                                                    <p className="text-[10px] text-center rounded bg-[#0026d9] text-white px-4 py-2">
                                                        Compacto
                                                    </p>
                                                )}
                                                {detail.highlight_bottom && (
                                                    <p className="text-[10px] text-center rounded bg-[#0026d9] text-white px-4 py-2">
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
                                                    {detail.images.map((imgUrl: string, idx: number) => {
                                                        const imgName = imgUrl.split("/").pop() || `imagem_${idx + 1}`;
                                                        return (
                                                            <a
                                                                style={{ color: "#0026d9" }}
                                                                key={idx}
                                                                href={imgUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                download={imgName}
                                                                className="flex flex-col items-center text-xs underline w-16"
                                                            >
                                                                <img
                                                                    src={imgUrl}
                                                                    alt={imgName}
                                                                    className="w-10 h-10 object-cover rounded mb-1 border"
                                                                />

                                                            </a>
                                                        );
                                                    })}
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
                                                            {Array.isArray(group.images) &&
                                                                group.images.length > 0 && (
                                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                                        {group.images.map((imgUrl: string, idx: number) => {
                                                                            const imgName = imgUrl.split("/").pop() || `imagem_${idx + 1}`;
                                                                            return (
                                                                                <a
                                                                                    style={{ color: "#0026d9" }}
                                                                                    key={idx}
                                                                                    href={imgUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    download={imgName}
                                                                                    className="flex flex-col items-center text-xs underline w-16"
                                                                                >
                                                                                    <img
                                                                                        src={imgUrl}
                                                                                        alt={imgName}
                                                                                        className="w-10 h-10 object-cover rounded mb-1 border"
                                                                                    />

                                                                                </a>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            <div className="space-y-2">
                                                                {group.options.map((option, optionIdx) => (
                                                                    <div
                                                                        key={`${option.id}-${optionIdx}`}
                                                                        className="flex flex-col gap-1 border border-gray-100 rounded px-3 py-2"
                                                                    >
                                                                        <div className="flex items-center justify-between">
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
                                                                        {/* Exibe bônus se for objeto ou array */}
                                                                        {option.bonus && (
                                                                            <div style={{
                                                                                background: 'var(--color-background-secondary)',
                                                                                borderRadius: 8,
                                                                                padding: '8px 10px',
                                                                                display: 'grid',
                                                                                gridTemplateColumns: '1fr 1fr',
                                                                                gap: '6px 12px',
                                                                                marginTop: 8
                                                                            }}>
                                                                                {/* Header */}
                                                                                <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 6, borderBottom: '0.5px solid var(--color-border-tertiary)', marginBottom: 2 }}>
                                                                                    <span className="text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-blue-700 rounded px-2 py-0.5">
                                                                                        Bônus
                                                                                    </span>
                                                                                    <span className="text-xs font-medium text-gray-800">{option.bonus.type}</span>
                                                                                </div>

                                                                                {/* Campos */}
                                                                                {option.bonus.speed && (
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Velocidade</span>
                                                                                        <span className="text-xs text-gray-600 font-medium">{option.bonus.speed} Mbps</span>
                                                                                    </div>
                                                                                )}
                                                                                {option.bonus.description && (
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Descrição</span>
                                                                                        <span className="text-xs text-gray-600 font-medium">{option.bonus.description}</span>
                                                                                    </div>
                                                                                )}
                                                                                {typeof option.bonus.price !== 'undefined' && (
                                                                                    <div className="flex flex-col gap-0.5">
                                                                                        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Preço do bônus</span>
                                                                                        <span className="text-xs text-blue-700 font-medium">
                                                                                            {option.bonus.price > 0 ? formatBRL(option.bonus.price) : '-'}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
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

                                                            {Array.isArray(group.images) &&
                                                                group.images.length > 0 && (
                                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                                        {group.images.map((imgUrl: string, idx: number) => {
                                                                            const imgName = imgUrl.split("/").pop() || `imagem_${idx + 1}`;
                                                                            return (
                                                                                <a
                                                                                    style={{ color: "#0026d9" }}
                                                                                    key={idx}
                                                                                    href={imgUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    download={imgName}
                                                                                    className="flex flex-col items-center text-xs underline w-16"
                                                                                >
                                                                                    <img
                                                                                        src={imgUrl}
                                                                                        alt={imgName}
                                                                                        className="w-10 h-10 object-cover rounded mb-1 border"
                                                                                    />

                                                                                </a>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}

                                                            <div className="space-y-2">
                                                                {group.options.map((option, optionIdx) => {

                                                                    return (
                                                                        <div
                                                                            key={`${option.id}-${optionIdx}`}
                                                                            className="flex flex-col gap-1 border border-gray-100 rounded px-3 py-2"
                                                                        >
                                                                            <div className="flex items-center justify-between">
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
                                                                            {/* Exibe bônus se for objeto ou array */}
                                                                            {option.bonus && (
                                                                                <div style={{
                                                                                    borderTop: '0.5px solid var(--color-border-tertiary)',
                                                                                    background: 'var(--color-background-secondary)',
                                                                                    padding: '10px 12px',
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    gap: 8,
                                                                                    marginTop: 8,
                                                                                    borderRadius: 8,
                                                                                }}>
                                                                                    {/* Linha 1: badge + tipo */}
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                                        <span className="text-[10px] font-medium uppercase tracking-wider bg-blue-50 text-blue-700 rounded px-2 py-0.5">
                                                                                            Bônus
                                                                                        </span>
                                                                                        {option.bonus.type && (
                                                                                            <span className="text-xs text-gray-500 font-medium">{option.bonus.type}</span>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Linha 2: velocidade + preço lado a lado */}
                                                                                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12 }}>
                                                                                        {option.bonus.speed > 0 ? (
                                                                                            <div className="flex flex-col gap-0.5">
                                                                                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Velocidade</span>
                                                                                                <span className="text-xs text-gray-600 font-medium">{option.bonus.speed} Mbps</span>
                                                                                            </div>
                                                                                        ) : "-"}
                                                                                        {typeof option.bonus.price !== 'undefined' && (
                                                                                            <div className="flex flex-col gap-0.5">
                                                                                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Preço</span>
                                                                                                <span className="text-xs text-blue-700 font-medium">
                                                                                                    {option.bonus.price > 0 ? formatBRL(option.bonus.price) : "-"}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Linha 3: descrição em largura total */}
                                                                                    {option.bonus.description && (
                                                                                        <div className="flex flex-col gap-0.5">
                                                                                            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Descrição</span>
                                                                                            <span className="text-xs text-gray-600 font-medium leading-relaxed">
                                                                                                {option.bonus.description}
                                                                                            </span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
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


                </div>
                {/* Ações */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        className={blueOutlineButtonClass}
                        onClick={() => setShowEditProductLayout(true)}
                    >
                        Editar Plano
                    </Button>
                    <Button
                        className={redOutlineButtonClass}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Deletar Plano
                    </Button>
                </div>
            </div>
        </>
    );
}