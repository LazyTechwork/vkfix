export function extractQuotedTexts(text: string): string[] | undefined {
    try {
        // Проверяем, что текст начинается и заканчивается кавычкой
        if (!text || typeof text !== 'string' || !text.startsWith('"') || !text.endsWith('"')) {
            return undefined;
        }

        // Убедимся, что внутри строки нет ничего кроме кавычек и запятых
        // Преобразуем наш текст к виду, совместимому с JSON
        // "[...]", "[...]", "[...]" -> ["[...]", "[...]", "[...]"]
        let jsonArray = '[' + text + ']';
        // Заменяем ", " на ",
        jsonArray = jsonArray.replace(/",\s*"/g, '", "');
        // Заменяем первую кавычку и последнюю
        jsonArray = jsonArray.replace(/^\["/, '["').replace(/"\]$/, '"]');

        try {
            // Пробуем распарсить как JSON-массив
            const parsed = JSON.parse(jsonArray);
            // Если успешно, возвращаем результат
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
        } catch {
            // Если не получилось, пробуем сначала исправить экранирование
            let corrected = text;

            // Заменяем \\" на \"
            corrected = corrected.replace(/\\\\"/g, '\\"');

            // Теперь пробуем создать JSON массив снова
            let correctedJsonArray = '[' + corrected + ']';
            correctedJsonArray = correctedJsonArray.replace(/",\s*"/g, '", "');
            correctedJsonArray = correctedJsonArray.replace(/^\["/, '["').replace(/"\]$/, '"]');

            try {
                const parsedCorrected = JSON.parse(correctedJsonArray);
                return Array.isArray(parsedCorrected) && parsedCorrected.length > 0 ? parsedCorrected : null;
            } catch {
                // Если и это не сработало, попробуем еще один метод
                // Просто разбиваем строку на части по запятым и очищаем от кавычек
                const parts = text.split(/",\s*"/);

                const result = parts.map(part => {
                    // Убираем внешние кавычки
                    let cleaned = part.trim();
                    if (cleaned.startsWith('"')) {
                        cleaned = cleaned.substring(1);
                    }
                    if (cleaned.endsWith('"')) {
                        cleaned = cleaned.substring(0, cleaned.length - 1);
                    }

                    // Заменяем экранированные кавычки
                    cleaned = cleaned.replace(/\\"/g, '"');

                    return cleaned;
                });

                return result.length > 0 ? result : null;
            }
        }
    } catch (error) {
        console.error("Error in extractQuotedTexts:", error);

        // Еще одна попытка - самый простой метод
        try {
            // Просто удаляем внешние кавычки и заменяем экранированные
            let extracted = text.trim();

            // Убираем внешние кавычки
            if (extracted.startsWith('"') && extracted.endsWith('"')) {
                extracted = extracted.substring(1, extracted.length - 1);
            } else {
                return undefined;
            }

            // Заменяем экранированные кавычки
            extracted = extracted.replace(/\\"/g, '"');

            // Если есть запятые, разбиваем
            if (extracted.includes(',')) {
                return extracted.split(',').map(s => s.trim());
            }

            return [extracted];
        } catch {
            return undefined;
        }
    }
}