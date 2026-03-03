export interface TranslationResult {
    translatedTitle: string;
    translatedContent: string;
}

export async function translateArticle(
    title: string,
    content: string
): Promise<TranslationResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not defined');
    }

    const prompt = `
Bạn là một chuyên gia bóng đá hàng đầu với khả năng viết lách xuất sắc, chuyên gia tối ưu hóa trải nghiệm đọc và SEO.
Nhiệm vụ của bạn là dịch sát nghĩa nhất có thể bài báo bóng đá sau đây sang tiếng Việt.

YÊU CẦU VỀ NỘI DUNG & BỐ CỤC:
1. THÀNH PHẦN BỔ SUNG (MANDATORY):
   - SAPO: Đoạn dẫn tóm tắt ngắn gọn (2-3 câu), in đậm. Đây là phần duy nhất bạn tự viết dựa trên nội dung bài.
   - KEY HIGHLIGHTS: Ngay sau Sapo, BẮT BUỘC phải có khối tóm tắt 3-4 điểm chính dưới dạng danh sách <ul> trong thẻ <div class="key-highlights">. Phần này được phép tóm tắt ý chính từ bài.
2. TRUNG THỰC TUYỆT ĐỐI (CRITICAL):
   - DỊCH CHÍNH XÁC 100% nội dung gốc của bài báo. KHÔNG được tóm tắt, KHÔNG được bỏ sót bất kỳ đoạn văn nào, KHÔNG được tự ý thay đổi trật tự các sự kiện hay ý kiến của tác giả gốc.
   - Giữ nguyên văn phong chuyên nghiệp của một tờ báo thể thao lớn.
3. CẤU TRÚC LINH HOẠT (H2/H3): Sử dụng <h2> hoặc <h3> để chia ý khi bài dài, nhưng phải dựa trên cấu trúc đề mục của văn bản gốc (nếu có).
4. MEDIA & EMBED: Giữ nguyên các thẻ [MEDIA_IMAGE...] và [MEDIA_EMBED...] tại đúng vị trí tương đối của chúng trong văn bản gốc.
5. HTML OUTPUT: Trả về mã HTML sạch (p, div.key-highlights, h2, h3, ul, li) kèm các block [MEDIA_IMAGE...] giữ nguyên. KHÔNG bao gồm <html>, <head> hay <body>. Trả về ĐÚNG ĐỊNH DẠNG JSON HỢP LỆ, KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO BÊN NGOÀI JSON.

VĂN BẢN GỐC CẦN XỬ LÝ:
TIÊU ĐỀ: ${title}
NỘI DUNG:
${content}

HÃY TRẢ VỀ JSON: {"translatedTitle": "...", "translatedContent": "..."}
`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001", // Default model, can be configured
                messages: [
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            }),
        });

        const data = await response.json();
        let resultText = data.choices[0].message.content;

        // Sometimes the AI wraps JSON in markdown block ticks
        if (resultText.startsWith('```json')) {
            resultText = resultText.replace(/^```json\n/, '').replace(/\n```$/, '');
        }

        let parsed = JSON.parse(resultText) as TranslationResult;

        // Fallback: If AI didn't convert tags, do it manually
        let finalHtml = parsed.translatedContent;

        // Filter out AI hallucinations / placeholders
        finalHtml = finalHtml.replace(/\[MEDIA_IMAGE:\s*https?:\/\/example\.com\/[^\]]+\]/g, '');
        finalHtml = finalHtml.replace(/\[MEDIA_EMBED:\s*your_video_id[^\]]*\]/g, '');
        // Also remove if it already turned into HTML (just in case AI ignored instructions)
        finalHtml = finalHtml.replace(/<figure[^>]*>[\s\S]*?example\.com[\s\S]*?<\/figure>/g, '');
        finalHtml = finalHtml.replace(/<iframe[^>]*your_video_id[^>]*><\/iframe>/g, '');

        // 1. Convert media embeds manually
        finalHtml = finalHtml.replace(/\[MEDIA_EMBED:\s*([\s\S]+?)\]/g, (match, htmlCode) => {
            return htmlCode;
        });

        // 2. Convert media images manually
        finalHtml = finalHtml.replace(/\[MEDIA_IMAGE:\s*(.+?)\s*\|\s*(.*?)\s*\]/g, (match, url, alt) => {
            return `<figure style="margin: 3rem 0; text-align: center;"><img src="${url}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" /><figcaption style="color: #888; margin-top: 1.2rem; font-style: italic; font-size: 0.95rem; padding: 0 2rem;">Ảnh: ${alt}</figcaption></figure>`;
        });

        parsed.translatedContent = finalHtml;
        return parsed;

    } catch (error) {
        console.error("Translation JSON parse error. Reverting to basic clean-up.");
        // If it totally fails, at least strip the ugly tags from original content so it doesn't break the UI
        let safeContent = content.replace(/\[MEDIA_EMBED:\s*([\s\S]+?)\]/g, '$1');
        safeContent = safeContent.replace(/\[MEDIA_IMAGE:\s*(.+?)\s*\|\s*(.*?)\s*\]/g, '');

        return {
            translatedTitle: title, // Fallback to original
            translatedContent: safeContent
        };
    }
}
