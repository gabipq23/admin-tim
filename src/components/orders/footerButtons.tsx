import { Button } from "antd";

interface FooterButtonsProps {
  onGeneratePDF: () => void;
  onEdit: () => void;
  onDelete: () => void;
  generatePDFText?: string;
  editText?: string;
  deleteText?: string;
}

export default function FooterButtons({
  onGeneratePDF,
  onEdit,
  onDelete,
  generatePDFText = "Gerar PDF",
  editText = "Editar",
  deleteText = "Deletar pedido",
}: FooterButtonsProps) {

  const outlineButtonClass =
    "!border-[#0026d9] !text-[#0026d9] hover:!border-[#0026d9] hover:!bg-[#0026d914]";

  const redOutlineButtonClass =
    "!border-[#ef4444] !text-[#ef4444] hover:!border-[#ef4444] hover:!bg-[#ef444414]";


  return (
    <>
      <div className="mt-4 flex gap-4 justify-end">
        <Button onClick={onGeneratePDF} className={outlineButtonClass}>
          {generatePDFText}
        </Button>
        <Button
          onClick={onEdit}
          className={outlineButtonClass}

          style={{
            color: "#0026d9",
            fontSize: "14px",
          }}
        >
          {editText}
        </Button>
        <Button
          onClick={onDelete}
          // color="red"
          // variant="outlined"
          className={redOutlineButtonClass}
          style={{
            fontSize: "14px",
          }}
        >
          {deleteText}
        </Button>
      </div>
    </>
  );
}
