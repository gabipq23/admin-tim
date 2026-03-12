import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, TableColumnsType, Tooltip } from "antd";
import { formatDateTimeBR } from "@/utils/formatDateTimeBR";
import { MonthOffer } from "@/interfaces/monthOffer";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyle } from "@/style/tableStyle";
import { blueOutlineButtonClass, redOutlineButtonClass } from "@/utils/buttonStyles";

interface MonthOffersFilterControllerProps {
  onEditDescription: (item: MonthOffer) => void;
  onDeleteItem: (item: MonthOffer) => void;
  onDownloadItem: (item: MonthOffer) => void;
}

function getFiltersFromURL(): any {
  const params = new URLSearchParams(window.location.search);
  const nome = params.get("nome") || "";
  const dataDe = params.get("dataDe") || "";
  const dataAte = params.get("dataAte") || "";
  const pagina = params.get("pagina") || "1";
  return {
    nome,
    dataDe,
    dataAte,
    pagina: Number(pagina),
  };
}

export function useMonthOffersFilterController({
  onEditDescription,
  onDeleteItem,
  onDownloadItem,
}: MonthOffersFilterControllerProps) {
  const { styles } = useStyle();
  const filters = getFiltersFromURL();
  const navigate = useNavigate();

  const currentPage = filters.pagina;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      nome: filters.nome || "",
      dataDe: filters.dataDe || "",
      dataAte: filters.dataAte || "",
    },
  });

  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const params = new URLSearchParams();
    if (data.nome) {
      params.set("nome", data.nome);
    }
    if (data.dataDe) {
      params.set("dataDe", data.dataDe);
    }
    if (data.dataAte) {
      params.set("dataAte", data.dataAte);
    }
    params.set("pagina", "1");

    navigate(`?${params.toString()}`);
    setIsFiltered(true);
  };

  const clearFilters = () => {
    reset();
    navigate("");
    setIsFiltered(false);
  };

  const tableColumns: TableColumnsType<MonthOffer> = [
    {
      title: "Id",
      dataIndex: "id",
      width: 40,
    },

    {
      title: "Nome",
      dataIndex: "nome",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (nome) => (
        <Tooltip
          placement="topLeft"
          title={nome}
          styles={{ body: { fontSize: "12px" } }}
        >
          {nome || "-"}
        </Tooltip>
      ),
    },

    {
      title: "Data e Hora de Upload",
      dataIndex: "data_upload",
      width: 80,
      render: (data_upload: string) => {
        return formatDateTimeBR(data_upload);
      },
    },

    {
      title: "Descrição ",
      dataIndex: "descricao",
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (descricao) => (
        <Tooltip
          placement="topLeft"
          title={descricao}
          styles={{ body: { fontSize: "12px" } }}
        >
          {descricao || "-"}
        </Tooltip>
      ),
    },

    {
      title: "",
      dataIndex: "actions",
      width: 120,
      render: (_, record) => (
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorBorder: "#0026d9",
                colorText: "#0026d9",
                colorPrimary: "#0026d9",
                colorPrimaryHover: "#883fa2",
              },
            },
          }}
        >
          <div className="flex gap-4">
            <Tooltip
              title="Editar descrição"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                style={{ width: "28px", height: "28px", padding: "0" }}
                className={blueOutlineButtonClass}
                onClick={() => onEditDescription(record)}
              >
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip
              title="Download"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                style={{ width: "28px", height: "28px", padding: "0" }}
                className={blueOutlineButtonClass}
                onClick={() => onDownloadItem(record)}
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
            <Tooltip
              title="Remover"
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <Button
                onClick={() => onDeleteItem(record)}
                style={{ width: "28px", height: "28px", padding: "0" }}
                className={redOutlineButtonClass}
                danger
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </div>
        </ConfigProvider>
      ),
    },
    // {
    //   title: "",
    //   dataIndex: "online",
    //   width: 50,
    //   render: () => (
    //     <ConfigProvider
    //       theme={{
    //         components: {
    //           Button: {
    //             colorBorder: "#0026d9",
    //             colorText: "#0026d9",

    //             colorPrimary: "#0026d9",

    //             colorPrimaryHover: "#883fa2",
    //           },
    //         },
    //       }}
    //     >
    //       <Tooltip
    //         title="Download"
    //         placement="top"
    //         styles={{ body: { fontSize: "12px" } }}
    //       >
    //         <Button className="w-6 h-6">
    //           <DownloadOutlined />
    //         </Button>
    //       </Tooltip>
    //     </ConfigProvider>
    //   ),
    // },
  ];
  return {
    tableColumns,
    styles: { customTable: styles.customTable },
    isFiltered,
    control,
    handleSubmit,
    onSubmit,
    clearFilters,
    currentPage,
  };
}
