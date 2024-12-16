import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  language: string;
  onChange: (language: string) => void;
  className?: string;
}

const languages = [
  { code: "auto", name: "Detectar idioma" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export const LanguageSelector = ({ language, onChange, className = "" }: LanguageSelectorProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Selecione o Idioma</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "ghost"}
            className={cn(
              "language-chip relative",
              language === lang.code && "bg-primary text-primary-foreground",
              language === lang.code && lang.code !== "auto" && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => onChange(lang.code)}
          >
            {lang.name}
            {language === lang.code && (
              <Check className="w-4 h-4 ml-2" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};