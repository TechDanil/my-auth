export const resolveEnvTemplate = (value?: string) =>
  (value ?? "").replace(
    /\$\{(\w+)\}/g,
    (_, key: string) => process.env[key] ?? "",
  );
