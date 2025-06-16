import { getI18n } from "@locales/server";

export type TranslationFunction = Awaited<ReturnType<typeof getI18n>>;
