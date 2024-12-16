import { useState, useEffect } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslationPanel } from "@/components/TranslationPanel";
import { OCRCamera } from "@/components/OCRCamera";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { detectLanguage, translateText, getDetailedExplanation } from "@/lib/groq";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const detectInputLanguage = async () => {
      if (inputText.trim().length > 3) {
        try {
          const detectedLang = await detectLanguage(inputText);
          if (detectedLang !== sourceLanguage && sourceLanguage !== "auto") {
            setSourceLanguage(detectedLang);
            toast({
              title: "Idioma detectado",
              description: `Idioma alterado para: ${detectedLang}`,
            });
          }
        } catch (error) {
          console.error("Erro ao detectar idioma:", error);
        }
      }
    };

    const debounceTimer = setTimeout(detectInputLanguage, 1000);
    return () => clearTimeout(debounceTimer);
  }, [inputText, sourceLanguage, toast]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite algum texto para traduzir",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsTranslating(true);
      
      let detectedLanguage = sourceLanguage;
      if (sourceLanguage === "auto") {
        detectedLanguage = await detectLanguage(inputText);
        setSourceLanguage(detectedLanguage);
        toast({
          title: "Idioma detectado",
          description: `Texto identificado como: ${detectedLanguage}`,
        });
      }

      const translated = await translateText(inputText, targetLanguage);
      setOutputText(translated);
    } catch (error) {
      toast({
        title: "Erro na tradução",
        description: "Não foi possível traduzir o texto. Tente novamente.",
        variant: "destructive",
      });
      console.error("Erro na tradução:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRequestDetails = async () => {
    if (!outputText) return;

    try {
      const details = await getDetailedExplanation(inputText, targetLanguage);
      toast({
        title: "Detalhes da tradução",
        description: details,
        duration: 10000,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível obter os detalhes. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleOCRText = async (text: string) => {
    setInputText(text);
    setShowCamera(false);
    handleTranslate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background p-6">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tradutor Universal
          </h1>
          <p className="text-lg text-muted-foreground">
            Quebre barreiras linguísticas facilmente
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between">
              <LanguageSelector
                language={sourceLanguage}
                onChange={setSourceLanguage}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCamera(true)}
                className="ml-2"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <TranslationPanel
              type="input"
              value={inputText}
              onChange={setInputText}
              placeholder="Digite o texto para traduzir..."
            />
          </div>

          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <LanguageSelector
              language={targetLanguage}
              onChange={setTargetLanguage}
            />
            <TranslationPanel
              type="output"
              value={outputText}
              placeholder="A tradução aparecerá aqui..."
              onRequestDetails={handleRequestDetails}
            />
          </div>
        </div>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Button
            size="lg"
            className="px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? "Traduzindo..." : "Traduzir"}
          </Button>
        </div>
      </div>

      {showCamera && <OCRCamera onTextDetected={handleOCRText} />}
    </div>
  );
};

export default Index;