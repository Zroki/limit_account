interface LimitsV2 {
  headers: string,
  fields: Essense[],
}

interface Essense {
  current: number,
  limit?: number,
  label: string,
}
