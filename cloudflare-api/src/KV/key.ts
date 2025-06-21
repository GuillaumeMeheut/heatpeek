export const configKey = (trackingId: string, path: string) =>
  `config:t-${trackingId}-p-${path}`;

export const snapshotKey = (trackingId: string, path: string) =>
  `snapshot:t-${trackingId}-p-${path}`;
