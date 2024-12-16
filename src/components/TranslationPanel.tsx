import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { AudioControls } from "./translation/AudioControls";
import { OutputControls } from "./translation/OutputControls";
import { useSpeechRecognition } from "./translation/useSpeechRecognition";

interface TranslationPanelProps {
  type: "input" | "output";
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  onRequestDetails?: () => void;
}

export const TranslationPanel = ({
  type,
  value,
  onChange,
  placeholder,
  className,
  onRequestDetails,
}: TranslationPanelProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const { isRecording, handleMicClick } = useSpeechRecognition(text => onChange?.(text));

  const handlePlayAudio = () => {
    const utterance = new SpeechSynthesisUtterance(value);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast({
        title: "Sucesso",
        description: "Texto copiado para a área de transferência",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("glass-panel rounded-2xl p-4", className)}>
      <div className="relative">
        {type === "input" ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="translate-input"
            rows={4}
          />
        ) : (
          <div className="translate-output">{value || placeholder}</div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-2">
        {type === "input" ? (
          <AudioControls isRecording={isRecording} onMicClick={handleMicClick} />
        ) : (
          <OutputControls
            onPlayAudio={handlePlayAudio}
            onCopy={handleCopy}
            isCopied={isCopied}
            onRequestDetails={onRequestDetails}
          />
        )}
      </div>
    </div>
  );
};