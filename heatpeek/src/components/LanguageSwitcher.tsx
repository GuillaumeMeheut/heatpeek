"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguage.letter}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className="flex items-center gap-2"
            onClick={() => changeLocale(language.code)}
          >
            <span className="font-medium">{language.letter}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
