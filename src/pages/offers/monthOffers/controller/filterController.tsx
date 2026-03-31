import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, TableColumnsType, Tooltip } from "antd";
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
  const name = params.get("name") || "";
  const dateFrom = params.get("date_from") || "";
  const dateTo = params.get("date_to") || "";
  const page = params.get("page") || "1";
  const per_page = params.get("per_page") || "10";
  return {
    name,
    date_from: dateFrom,
    date_to: dateTo,
    page: Number(page),
    per_page: Number(per_page),
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

  const currentPage = filters.page;

  const { handleSubmit, reset, control } = useForm<any>({
    defaultValues: {
      name: filters.name || "",
      date_from: filters.date_from || "",
      date_to: filters.date_to || "",
      per_page: filters.per_page || "10",
    },
  });

  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const params = new URLSearchParams();
    if (data.name) {
      params.set("name", data.name);
    }
    if (data.date_from) {
      params.set("date_from", data.date_from);
    }
    if (data.date_to) {
      params.set("date_to", data.date_to);
    }
    params.set("page", "1");
    params.set("per_page", data.per_page || "10");

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
      dataIndex: "name",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip
          placement="topLeft"
          title={name}
          styles={{ body: { fontSize: "12px" } }}
        >
          {name || "-"}
        </Tooltip>
      ),
    },

    {
      title: "Data e Hora de Upload",
      dataIndex: "date_upload",
      width: 80,
      render: (date_upload: string) => {
        return (date_upload);
      },
    },

    {
      title: "Descrição ",
      dataIndex: "description",
      width: 160,
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip
          placement="topLeft"
          title={description}
          styles={{ body: { fontSize: "12px" } }}
        >
          {description || "-"}
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
                colorPrimaryHover: "#0026d9",
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
