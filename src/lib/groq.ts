const LIBRE_TRANSLATE_API = "https://libretranslate.de";

export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch(`${LIBRE_TRANSLATE_API}/detect`, {
      method: "POST",
      body: JSON.stringify({
        q: text
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Falha ao detectar idioma");
    }

    const data = await response.json();
    return data[0].language;
  } catch (error) {
    console.error("Erro na detecção de idioma:", error);
    return "en"; // fallback para inglês em caso de erro
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch(`${LIBRE_TRANSLATE_API}/translate`, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLanguage
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Falha na tradução");
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Erro na tradução:", error);
    throw error;
  }
}

export async function getDetailedExplanation(text: string, targetLanguage: string): Promise<string> {
  try {
    // Primeiro traduzimos o texto
    const translatedText = await translateText(text, targetLanguage);
    
    // Depois adicionamos uma explicação simples
    return `Tradução: ${translatedText}\n\nEste texto foi traduzido automaticamente usando LibreTranslate.`;
  } catch (error) {
    console.error("Erro ao gerar explicação:", error);
    throw error;
  }
}