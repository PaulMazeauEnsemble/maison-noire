export const useCMS = () => useState("cms", () => ({
  manifeste: null,
  clients: null,
  about: null,
  contact: null,
  settings: null,
}))