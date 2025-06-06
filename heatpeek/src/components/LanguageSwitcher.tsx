"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useCurrentLocale } from "../../locales/client";
import { useChangeLocale } from "../../locales/client";

const languages = [
  {
    code: "en",
    name: "English",
    letter: "EN",
  },
  {
    code: "fr",
    name: "Français",
    letter: "FR",
  },
] as const;

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <Select value={locale} onValueChange={changeLocale}>
      <SelectTrigger className="h-8">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue placeholder={currentLanguage.letter} />
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">{language.name}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
