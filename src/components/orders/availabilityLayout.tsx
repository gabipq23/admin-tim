import { OrderBandaLarga } from "@/interfaces/orderBandaLarga";
import { Tooltip } from "antd";

export const AvailabilityStatus = ({ localData }: { localData: OrderBandaLarga }) => {
    const timAvailability = localData.operators_availability?.tim;

    if (
        timAvailability?.availability === null ||
        timAvailability?.availability === undefined
    ) {
        return (
            <div className="flex flex-col items-center mt-2">
                <div className="flex items-center justify-center">-</div>
            </div>
        );
    }

    if (timAvailability.availability) {
        if (timAvailability.encontrado_via_range) {
            return (
                <div className="flex flex-col items-center mt-2">
                    <div className="flex items-center justify-center mb-2">
                        <Tooltip
                            title="Disponibilidade - Disponível (via range numérico)"
                            placement="top"
                            styles={{ body: { fontSize: "12px" } }}
                        >
                            <div className="h-2 w-2 bg-yellow-500 rounded-full cursor-pointer"></div>
                        </Tooltip>
                    </div>
                    <div className="text-center text-[11px] text-neutral-600 bg-yellow-50 px-2 py-1 rounded">
                        <strong>Range numérico:</strong> {timAvailability.range_min} -{" "}
                        {timAvailability.range_max}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center mt-2">
                    <div className="flex items-center justify-center">
                        <Tooltip
                            title="Disponibilidade - Disponível"
                            placement="top"
                            styles={{ body: { fontSize: "12px" } }}
                        >
                            <div className="h-2 w-2 bg-green-500 rounded-full cursor-pointer"></div>
                        </Tooltip>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
                <Tooltip
                    title="Disponibilidade - Indisponível"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                >
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </Tooltip>
            </div>
        </div>
    );
};

export const PAPStatus = ({ localData }: { localData: OrderBandaLarga }) => {
    if (
        localData.availability_pap === null ||
        localData.availability_pap === undefined
    ) {
        return (
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">-</div>
            </div>
        );
    }

    if (localData.availability_pap) {
        return (
            <div className="flex flex-col items-center mt-2">
                <div className="flex items-center justify-center">
                    <Tooltip
                        title="PAP - Disponível"
                        placement="top"
                        styles={{ body: { fontSize: "12px" } }}
                    >
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    </Tooltip>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-2">
            <div className="flex items-center justify-center">
                <Tooltip
                    title="PAP - Indisponível"
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                >
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                </Tooltip>
            </div>
        </div>
    );
};