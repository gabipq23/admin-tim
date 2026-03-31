import React, { useState } from "react";
import { Tooltip } from "antd";
import { formatBRL } from "@/utils/formatBRL";
import { PlanSelectedExtra } from "@/interfaces/orderBandaLarga";

export function PlanosTable({ plans }: { plans: any[] }) {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    const toggleExpand = (id: string) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="mt-4 text-neutral-700">
            {/* Header da tabela */}
            <div className="flex items-center font-semibold text-[#666666] text-[14px]">
                <p className="w-72 text-center">Plano</p>

                <p className="w-50 text-center">Data de Instalação 1</p>
                {/* <p className="w-32 text-center">Período 1</p> */}
                <p className="w-50 text-center">Data deInstalação 2</p>
                {/* <p className="w-32 text-center">Período 2</p> */}
                <p className="w-32 text-center">Vencimento</p>
                <p className="w-46 text-center">Total</p>
                <p className="w-12 text-center">Extras</p>
            </div>
            <hr className="border-t border-neutral-300 mx-2" />

            {plans.map((plan) => (
                <React.Fragment key={plan.id}>
                    <div className="flex items-center py-4 text-[14px] text-neutral-700 hover:bg-neutral-50 transition">
                        <p className="text-[14px] font-semibold w-72 text-center">
                            {plan.plan?.name
                                ? `${plan.plan.name} - ${plan.price_summary?.original_price != null ? formatBRL(plan.price_summary.original_price) : "-"}`
                                : "-"}
                        </p>
                        {/* <p className="text-[14px] font-semibold w-32 text-center">
                            {plan.price_summary?.plan_price
                                ? formatBRL(plan.price_summary.plan_price)
                                : "-"}
                        </p> */}
                        <p className="text-[14px] w-50 text-center">
                            {plan.installation_preferred_date_one + " - " + plan.installation_preferred_period_one || "-"}
                        </p>
                        {/* <p className="text-[14px] w-32 text-center">
                            {plan.installation_preferred_period_one || "-"}
                        </p> */}
                        <p className="text-[14px] w-50 text-center">
                            {plan.installation_preferred_date_two + " - " + plan.installation_preferred_period_two || "-"}
                        </p>
                        {/* <p className="text-[14px] w-32 text-center">
                            {plan.installation_preferred_period_two || "-"}
                        </p> */}
                        <p className="text-[14px] font-semibold w-32 text-center">
                            {plan.due_day?.toString() || "-"}
                        </p>
                        <p className="text-[14px] font-bold w-46 text-center text-[#0026d9]">
                            {plan.price_summary?.total_monthly
                                ? formatBRL(plan.price_summary.total_monthly)
                                : "-"}
                        </p>
                        {plan.selected_extras && plan.selected_extras.length > 0 ? (
                            <Tooltip title="Ver extras adicionados ao plano" placement="top">
                                <button
                                    className="w-12 text-center text-[#0026d9] font-bold focus:outline-none"
                                    onClick={() => toggleExpand(plan.id)}
                                    aria-label="Expandir extras"
                                    type="button"
                                >
                                    {expanded[plan.id] ? "−" : "+"}
                                </button>
                            </Tooltip>
                        ) : (
                            <button
                                className="w-12 text-center text-[#0026d9] font-bold focus:outline-none"
                                type="button"
                                disabled
                                aria-label="Sem extras"
                            >
                                {/* Sem extras */}
                            </button>
                        )}
                    </div>
                    {/* Linha expansível dos extras */}
                    {expanded[plan.id] && plan.selected_extras && plan.selected_extras.length > 0 && (
                        <div className="bg-neutral-50 px-8 py-2">
                            <div className="font-semibold text-[#666666] text-[14px] mb-1">
                                Extras adicionados
                            </div>
                            <ul className="divide-y divide-neutral-100">
                                {plan.selected_extras.map((extra: PlanSelectedExtra) => {
                                    const opt = extra.options && extra.options[0] ? extra.options[0] : undefined;
                                    return (
                                        <li key={extra.id} className="flex justify-between items-center py-2">
                                            <div>
                                                <div className="font-medium text-sm">{extra.label}</div>
                                                <div className="text-xs text-neutral-600">{opt?.description || ''}</div>
                                                {opt?.bonus && (opt.bonus.type || opt.bonus.speed || opt.bonus.description) && (
                                                    <div className="text-xs text-green-700">
                                                        {opt.bonus.type ? `Com ${extra.label}` : ''}
                                                        {opt.bonus.speed ? `+ ganhe ${opt.bonus.speed}` : ''}
                                                        {opt.bonus.description ? ` ${opt.bonus.description}` : ''}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-semibold text-sm">
                                                {typeof opt?.price === 'number' ? formatBRL(opt.price) : '-'}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    <hr className="border-t border-neutral-300 mx-2" />
                </React.Fragment>
            ))}
        </div>
    );
}