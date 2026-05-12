import * as ethers from "ethers";

interface SchemaField {
  name: string;
  type: string;
}

export function validatePayload(
  payload: Record<string, any>,
  schema: Record<string, SchemaField[]>,
) {
  if (typeof payload !== "object") {
    throw new Error("Payload must be an object");
  }
  const [schemaFields] = Object.values(schema);

  schemaFields.forEach((field) => {
    if (payload[field.name] === undefined || payload[field.name] === null) {
      throw new Error(`Missing field "${field.name}" in payload`);
    }

    if (
      field.type.includes("uint") &&
      (isNaN(Number(payload[field.name])) || Number(payload[field.name]) < 0)
    ) {
      throw new Error(`Field "${field.name}" incorrect uint type`);
    }

    if (field.type === "address" && !ethers.isAddress(payload[field.name])) {
      throw new Error(`Field "${field.name}" incorrect address type`);
    }
  });
}
