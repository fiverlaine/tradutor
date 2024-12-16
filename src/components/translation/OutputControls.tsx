import { Button } from "@/components/ui/button";
import { Volume2, Copy, Check, Info } from "lucide-react";

interface OutputControlsProps {
  onPlayAudio: () => void;
  onCopy: () => void;
  isCopied: boolean;
  onRequestDetails?: () => void;
}

export const OutputControls = ({
  onPlayAudio,
  onCopy,
  isCopied,
  onRequestDetails,
}: OutputControlsProps) => {
  return (
    <>
      <Button variant="ghost" size="icon" className="icon-button" onClick={onPlayAudio}>
        <Volume2 className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon" className="icon-button" onClick={onCopy}>
        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
      </Button>
      {onRequestDetails && (
        <Button variant="ghost" size="icon" className="icon-button" onClick={onRequestDetails}>
          <Info className="w-5 h-5" />
        </Button>
      )}
    </>
  );
};