import { formatBRL } from "@/utils/formatBRL";
import * as XLSX from "xlsx";

export const handleExportXLSX = (data: any, selectedRowKeys: any) => {
  if (!data || !selectedRowKeys || selectedRowKeys.length === 0) {
    return;
  }

  const pedidosSelecionados = data?.filter((item: any) =>
    selectedRowKeys.includes(item.id),
  );

  if (!pedidosSelecionados || pedidosSelecionados.length === 0) {
    return;
  }

  const camposMonetarios = ["plan.price"];
  const camposDataHora = [
    "created_at",
    "installation_preferred_date_one",
    "installation_preferred_date_two",
    "data_portabilidade",
    "data_portabilidade_adicional",
  ];

  // Definir a ordem desejada das colunas
  const ordemColunas = [
    "ordernumber",
    "created_at",
    "status",
    "status_pos_venda",
    "observacao_consultor",
    "razaosocial",
    "cnpj",
    "manager.name",
    "manager.cpf",
    "manager.email",
    "manager.phone",
    "manager.hasLegalAuthorization",
    "manager_name",
    "fullname",
    "phone",
    "phoneAdditional",
    "numero_valido",
    "numero_adicional_valido",
    "operadora",
    "operadora_adicional",
    "portabilidade",
    "data_portabilidade",
    "portabilidade_adicional",
    "data_portabilidade_adicional",
    "plan.name",
    "plan.speed",
    "plan.price",
    "availability",
    "availability_pap",
    "cep",
    "cep_unico",
    "encontrado_via_range",
    "range_min",
    "range_max",
    "address",
    "addressnumber",
    "addresscomplement",
    "addresslot",
    "addressblock",
    "addressFloor",
    "buildingorhouse",
    "district",
    "addressreferencepoint",
    "city",
    "state",
    "dueday",
    "installation_preferred_date_one",
    "installation_preferred_date_two",
    "installation_preferred_period_one",
    "installation_preferred_period_two",
    "typeclient",
    "credito",
    "empresas",
    "mei",
    "socio",
    "is_mei",
    "is_socio",
    "socios_empresas",
    "voz_fixa",
    "consultor_responsavel",
    "id_vivo_corp",
    "id_crm",
    "equipe",
    "url",
    "client_ip",
    "ip_isp",
    "ip_tipo_acesso",
    "provider",
    "provedor",
    "device",
    "so",
    "browser",
    "resolution",
    "is_comercial",
    "nome_whatsapp",
    "nome_receita",
    "recado",
    "avatar",
    "whatsapp.numero",
    "whatsapp.endereco",
    "whatsapp.categoria",
    "whatsapp.existe_no_whatsapp",
    "whatsapp.recado",
    "finger_print.os.name",
    "finger_print.os.version",
    "finger_print.browser.name",
    "finger_print.browser.version",
    "finger_print.device",
    "finger_print.timezone",
    "finger_print.timezone_offset",
    "finger_print.resolution.width",
    "finger_print.resolution.height",
    "finger_print.resolution.dpr",
    "fingerprintId",
    "second_call.number_attempts",
    "geolocalizacao.sucesso",
    "geolocalizacao.latitude",
    "geolocalizacao.longitude",
    "geolocalizacao.precisao",
    "geolocalizacao.distancia_km_ponto_mais_proximo",
    "geolocalizacao.tem_disponibilidade",
    "geolocalizacao.cep_mais_proximo",
    "geolocalizacao.endereco_formatado",
  ];

  const colNames: Record<string, string> = {
    ordernumber: "Número do Pedido",
    created_at: "Data de Criação",
    cnpj: "CNPJ",
    razaosocial: "Razão Social",
    fullname: "Nome Completo",
    phone: "Telefone",
    phoneAdditional: "Telefone Adicional",
    numero_valido: "Telefone Válido",
    numero_adicional_valido: "Telefone Adicional Válido",
    operadora: "Operadora",
    operadora_adicional: "Operadora Adicional",
    portabilidade: "Portabilidade",
    data_portabilidade: "Data Portabilidade",
    portabilidade_adicional: "Portabilidade Adicional",
    data_portabilidade_adicional: "Data Portabilidade Adicional",
    cep: "CEP",
    cep_unico: "CEP Único",
    encontrado_via_range: "Encontrado via Range",
    range_min: "Range Mínimo",
    range_max: "Range Máximo",
    address: "Endereço",
    addressnumber: "Número",
    addresscomplement: "Complemento",
    addresslot: "Lote",
    addressblock: "Quadra",
    addressFloor: "Andar",
    buildingorhouse: "Prédio ou Casa",
    district: "Bairro",
    addressreferencepoint: "Ponto de Referência",
    city: "Cidade",
    state: "Estado",
    "plan.name": "Nome do Plano",
    "plan.price": "Preço do Plano",
    "plan.speed": "Velocidade do Plano",
    installation_preferred_date_one: "Data Preferida 1",
    installation_preferred_date_two: "Data Preferida 2",
    installation_preferred_period_one: "Período Preferido 1",
    installation_preferred_period_two: "Período Preferido 2",
    dueday: "Dia de Vencimento",
    "manager.name": "Nome do Gestor",
    "manager.cpf": "CPF do Gestor",
    "manager.email": "E-mail do Gestor",
    "manager.phone": "Telefone do Gestor",
    "manager.hasLegalAuthorization": "Gestor com Autorização Legal",
    manager_name: "Nome do Gestor Simples",
    accept_offers: "Aceita Ofertas",
    terms_accepted: "Termos Aceitos",
    consulta: "Consulta Realizada",
    pedido: "Pedido Realizado",
    wantsFixedIp: "Deseja IP Fixo",
    typeclient: "Tipo de Cliente",
    credito: "Crédito",
    empresas: "Empresas",
    mei: "MEI",
    socio: "Sócio",
    is_mei: "É MEI",
    is_socio: "É Sócio",
    socios_empresas: "Sócios/Empresas",
    voz_fixa: "Voz Fixa",
    url: "URL",
    status: "Status",
    id_vivo_corp: "ID Vivo",
    id_crm: "ID CRM",
    consultor_responsavel: "Consultor Responsável",
    status_pos_venda: "Status Pós-Venda",
    equipe: "Equipe",
    client_ip: "IP do Cliente",
    ip_isp: "IP ISP",
    ip_tipo_acesso: "Tipo de Acesso IP",
    provider: "Provider",
    provedor: "Provedor",
    device: "Dispositivo",
    so: "Sistema Operacional",
    browser: "Navegador",
    resolution: "Resolução",
    is_comercial: "WhatsApp Comercial",
    nome_whatsapp: "Nome WhatsApp",
    nome_receita: "Nome na Receita",
    recado: "Recado WhatsApp",
    avatar: "Avatar WhatsApp",
    availability: "Disponibilidade",
    availability_pap: "Disponibilidade PAP",
    observacao_consultor: "Observação do Consultor",
    "whatsapp.numero": "WhatsApp Número",
    "whatsapp.endereco": "WhatsApp Endereço",
    "whatsapp.categoria": "WhatsApp Categoria",
    "whatsapp.existe_no_whatsapp": "Existe no WhatsApp",
    "whatsapp.recado": "WhatsApp Recado",
    "finger_print.os.name": "Fingerprint SO Nome",
    "finger_print.os.version": "Fingerprint SO Versão",
    "finger_print.browser.name": "Fingerprint Navegador Nome",
    "finger_print.browser.version": "Fingerprint Navegador Versão",
    "finger_print.device": "Fingerprint Dispositivo",
    "finger_print.timezone": "Fingerprint Timezone",
    "finger_print.timezone_offset": "Fingerprint Timezone Offset",
    "finger_print.resolution.width": "Fingerprint Largura",
    "finger_print.resolution.height": "Fingerprint Altura",
    fingerprintId: "Fingerprint ID",
    "second_call.number_attempts": "Segunda Chamada Tentativas",
    "geolocalizacao.sucesso": "Geolocalização Sucesso",
    "geolocalizacao.latitude": "Geolocalização Latitude",
    "geolocalizacao.longitude": "Geolocalização Longitude",
    "geolocalizacao.distancia_km_ponto_mais_proximo":
      "Distância (km) Ponto Mais Próximo",
    "geolocalizacao.tem_disponibilidade": "Geolocalização Tem Disponibilidade",
    "geolocalizacao.cep_mais_proximo": "Geolocalização CEP Mais Próximo",
    "geolocalizacao.endereco_formatado": "Geolocalização Endereço Formatado",
  };

  const pedidosFormatados = pedidosSelecionados.map((pedido: any) => {
    const linha: any = {};

    // Processar campos na ordem definida
    ordemColunas.forEach((key) => {
      if (key.includes(".")) {
        const valor = key
          .split(".")
          .reduce<any>(
            (acc, prop) =>
              acc !== undefined && acc !== null ? acc[prop] : undefined,
            pedido,
          );

        if (valor !== undefined) {
          if (camposMonetarios.includes(key)) {
            linha[colNames[key] || key] = formatBRL(valor);
          } else if (camposDataHora.includes(key)) {
            linha[colNames[key] || key] = valor;
          } else if (Array.isArray(valor)) {
            linha[colNames[key] || key] = valor
              .map((item) =>
                typeof item === "object" && item !== null
                  ? Object.values(item).join(" - ")
                  : String(item),
              )
              .join(" | ");
          } else if (typeof valor === "object" && valor !== null) {
            linha[colNames[key] || key] = JSON.stringify(valor);
          } else {
            linha[colNames[key] || key] = valor || "";
          }
        } else {
          linha[colNames[key] || key] = "";
        }
      } else {
        if (pedido[key] !== undefined) {
          const valor = pedido[key];

          if (camposMonetarios.includes(key)) {
            linha[colNames[key] || key] = formatBRL(valor);
          } else if (camposDataHora.includes(key)) {
            linha[colNames[key] || key] = valor;
          } else {
            linha[colNames[key] || key] = valor;
          }
        } else {
          linha[colNames[key] || key] = "";
        }
      }
    });

    // Aplicar formatações específicas
    linha[colNames["accept_offers"]] =
      pedido.accept_offers === 1 ? "Sim" : "Não";
    linha[colNames["terms_accepted"]] =
      pedido.terms_accepted === 1 ? "Sim" : "Não";
    linha[colNames["buildingorhouse"]] =
      pedido.buildingorhouse === "building" ? "Prédio" : "Casa";
    linha[colNames["availability"]] =
      pedido.availability === 1 || pedido.availability === true ? "Sim" : "Não";
    linha[colNames["availability_pap"]] = pedido.availability_pap
      ? "Sim"
      : "Não";
    linha[colNames["consulta"]] = pedido.consulta ? "Sim" : "Não";
    linha[colNames["pedido"]] = pedido.pedido ? "Sim" : "Não";
    linha[colNames["wantsFixedIp"]] = pedido.wantsFixedIp ? "Sim" : "Não";
    linha[colNames["numero_valido"]] = pedido.numero_valido ? "Sim" : "Não";
    linha[colNames["numero_adicional_valido"]] = pedido.numero_adicional_valido
      ? "Sim"
      : "Não";
    linha[colNames["mei"]] = pedido.mei ? "Sim" : "Não";
    linha[colNames["socio"]] = pedido.socio ? "Sim" : "Não";
    linha[colNames["is_mei"]] =
      pedido.is_mei === 1 || pedido.is_mei === true ? "Sim" : "Não";
    linha[colNames["is_socio"]] =
      pedido.is_socio === 1 || pedido.is_socio === true ? "Sim" : "Não";
    linha[colNames["is_comercial"]] = pedido.is_comercial ? "Sim" : "Não";
    linha[colNames["whatsapp.existe_no_whatsapp"]] = pedido.whatsapp
      ?.existe_no_whatsapp
      ? "Sim"
      : "Não";
    linha[colNames["whatsapp.is_comercial"]] = pedido.whatsapp?.is_comercial
      ? "Sim"
      : "Não";
    linha[colNames["whatsapp.sucesso"]] = pedido.whatsapp?.sucesso
      ? "Sim"
      : "Não";
    linha[colNames["geolocalizacao.sucesso"]] = pedido.geolocalizacao?.sucesso
      ? "Sim"
      : "Não";
    linha[colNames["geolocalizacao.tem_disponibilidade"]] = pedido
      .geolocalizacao?.tem_disponibilidade
      ? "Sim"
      : "Não";
    linha[colNames["manager.hasLegalAuthorization"]] = pedido.manager
      ?.hasLegalAuthorization
      ? "Sim"
      : "Não";
    linha[colNames["socios_empresas"]] = Array.isArray(pedido.socios_empresas)
      ? pedido.socios_empresas
          .map((item: any) => `${item.nome || ""} (${item.cnpj || ""})`)
          .join(" | ")
      : "";

    return linha;
  });

  const pedidoSheet = XLSX.utils.json_to_sheet(pedidosFormatados);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, pedidoSheet, "Pedidos Banda Larga PJ");

  XLSX.writeFile(workbook, `pedidos-banda-larga-pj-selecionados.xlsx`);
};
