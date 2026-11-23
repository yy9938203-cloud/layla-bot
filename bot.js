const http = require('http');

// Render provides the PORT environment variable
const PORT = process.env.PORT || 3000;

// Telegram Bot Token
const TOKEN = process.env.TELEGRAM_API_TOKEN || "9241496897:AAF9iZIaA0WE_jPE2o0G96Nw2Ax_t9IkWwQ";
const API_BASE = `https://api.telegram.org/bot${TOKEN}`;

// AI API Keys (Supports Gemini, Groq, or Anthropic)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AQ.Ab8RN6Lg2dDiCFoJ6petDjMDtsZ8f925Loo_4DY8MF9TRdPUSg";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// 🔒 SECURITY LOCK: Only Walid's Telegram Chat ID can access Layla
const AUTHORIZED_USER_IDS = [1667811770];

function isAuthorized(chatId) {
    return AUTHORIZED_USER_IDS.includes(Number(chatId));
}

// Conversation History Storage (Memory per user)
const conversationHistory = new Map();

function getHistory(chatId) {
    if (!conversationHistory.has(chatId)) {
        conversationHistory.set(chatId, []);
    }
    return conversationHistory.get(chatId);
}

function addToHistory(chatId, role, content) {
    const history = getHistory(chatId);
    history.push({ role, content });
    if (history.length > 12) {
        history.splice(0, history.length - 12);
    }
}

// System Directive for Layla
const LAYLA_SYSTEM_PROMPT = `أنتِ "ليلى" (Layla)، رئيسة العمليات التنفيذية (Chief of Staff & Executive Operations Director) لأسطول مكون من 14 وكيلاً ذكياً متخصصاً، تحت قيادة السيد وليد (Walid).

قواعدك الصارمة في التواصل:
1. التحدث بلغة عربية فصيحة، راقية، مباشرة ومهنية، مع القدرة الكاملة على فهم مختلف اللهجات واللغات (الإنجليزية، الفرنسية، الإسبانية).
2. عدم استخدام عبارات الذكاء الاصطناعي المستهلكة أو الإطراء المبالغ فيه (مثل: "سؤال رائع"، "بالتأكيد"، "من دواعي سروري"). الإجابة تكون عملية ومباشرة وفي صلب الموضوع.
3. منع التخمين نهائياً (Zero Hallucination): لا تختلقي أرقاماً، ولا بيانات طلبات غير مؤكدة. عند نقص المعلومة قولي بصراحة أن المعلومة غير متوفرة ومطلوب تحديدها.
4. التقنيات المعتمدة لجميع المشاريع البرمجية: PHP Laravel، قواعد بيانات MySQL، واجهات Bootstrap CSS، وتطبيقات أندرويد Java (ممنوع تماماً ووردبريس أو القوالب الجاهزة).

هيكلية أسطول الـ 14 وكيلاً تحت إشرافك:
1. operator-agent: تخطيط العمليات، مسارات الإجراءات (Runbooks) والانضباط الميداني.
2. challenger-agent: فريق النقد (Red Team)، اكتشاف الثغرات والمخاطر واختبار الأفكار.
3. innovator-agent: الابتكار، ابتكار الميزات التنافسية وآليات النمو.
4. developer-agent: تطوير البرمجيات الشامل (Laravel + MySQL + Bootstrap + Android Java).
5. qa-agent: فحص الجودة ومراجعة الأمان واختبارات الأداء.
6. ordering-agent: إدارة دورة حياة التذاكر وحجز المقاعد وحالات الطلب.
7. accounting-agent: الفواتير، الضرائب وبوابات الدفع (Stripe/PayPal).
8. vendor-catalog-agent: إدارة التجار وقوائم الفعاليات ومزامنة المخزون.
9. risk-fraud-agent: مكافحة الاحتيال وتفادي البوتات وتذاكر السوق السوداء.
10. logistics-dispatch-agent: توليد وفحص أكواد الدخول (QR Codes) والتحقق منها.
11. customer-support-agent: خدمة العملاء الذكية والفرز وحل النزاعات.
12. amazon-seller-agent: متجر أمازون وإدراج المنتجات المتوافقة مع معايير المنصة.
13. social-media-agent: سيناريوهات تيك توك الفيروسية والمحتوى التسويقي المرئي.
14. marketing-agent: تحسين محركات البحث (SEO) وتصدر المتاجر (ASO).

عند التعامل مع أسئلة وطلبات العملاء (Customer Support Protocol):
- إذا سأل العميل أو السيد وليد عن مشكلة تخص تذكرة أو طلب، يتدخل وكيل خدمة العملاء (customer-support-agent) بطرح الأسئلة التشخيصية الصحيحة فوراً:
  * طلب رقم الطلب (Order ID) أو البريد الإلكتروني للشراء.
  * نوع المشكلة بدقة (دفع، عدم وصول التذكرة، استرجاع).
- تقديم حلول منطقية وواضحة ومنظمة في خطوات مرقمة.`;

// Call Telegram API
async function callTelegram(method, params = {}) {
    try {
        const res = await fetch(`${API_BASE}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        return await res.json();
    } catch (err) {
        console.error(`Telegram API Error (${method}):`, err.message);
        return null;
    }
}

async function sendTypingAction(chatId) {
    await callTelegram('sendChatAction', {
        chat_id: chatId,
        action: 'typing'
    });
}

async function sendMessage(chatId, text) {
    let res = await callTelegram('sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    });

    if (!res || !res.ok) {
        // Fallback to plain text if HTML tags fail to parse
        const plainText = text.replace(/<[^>]*>/g, '');
        res = await callTelegram('sendMessage', {
            chat_id: chatId,
            text: plainText
        });
    }

    return res;
}

// 🧠 AI LLM Query (Multi-Provider: Gemini -> Groq -> Anthropic)
async function queryAI(userText, chatId) {
    const history = getHistory(chatId);

    // 1. Try Google Gemini (Fast & Free)
    if (GEMINI_API_KEY) {
        try {
            const contents = [
                { role: 'user', parts: [{ text: LAYLA_SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'أهلاً بك يا فندم. أنا ليلى وجاهزة بكامل الجاهزية والتركيز.' }] }
            ];

            for (const item of history) {
                contents.push({
                    role: item.role === 'user' ? 'user' : 'model',
                    parts: [{ text: item.content }]
                });
            }

            contents.push({ role: 'user', parts: [{ text: userText }] });

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${GEMINI_API_KEY}`;
            const res = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.6,
                        maxOutputTokens: 1200
                    }
                })
            });

            const data = await res.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
        } catch (err) {
            console.error('Gemini error:', err.message);
        }
    }

    // 2. Try Groq (Ultra-Fast Llama 3.3 70B)
    if (GROQ_API_KEY) {
        try {
            const messages = [
                { role: 'system', content: LAYLA_SYSTEM_PROMPT }
            ];
            for (const item of history) {
                messages.push({ role: item.role, content: item.content });
            }
            messages.push({ role: 'user', content: userText });

            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: messages,
                    temperature: 0.6,
                    max_tokens: 1200
                })
            });

            const data = await res.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            }
        } catch (err) {
            console.error('Groq error:', err.message);
        }
    }

    // 3. Try Anthropic (Claude)
    if (ANTHROPIC_API_KEY) {
        try {
            const messages = [];
            for (const item of history) {
                messages.push({ role: item.role, content: item.content });
            }
            messages.push({ role: 'user', content: userText });

            const res = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-haiku-20241022',
                    system: LAYLA_SYSTEM_PROMPT,
                    max_tokens: 1200,
                    messages: messages
                })
            });

            const data = await res.json();
            if (data.content && data.content[0] && data.content[0].text) {
                return data.content[0].text;
            }
        } catch (err) {
            console.error('Anthropic error:', err.message);
        }
    }

    return null;
}

// Layla Dynamic Reply Generator
async function generateLaylaReply(userText, chatId) {
    const text = userText.trim();
    const lower = text.toLowerCase();

    // Standard Quick Commands
    if (text === '/start') {
        return `<b>أهلاً بك يا فندم 👑</b>\n\nأنا <b>ليلى</b>، رئيسة العمليات التنفيذية المشرفة على أسطول الـ 14 وكيلاً.\n\n• اكتب <code>/agents</code> للاطلاع على تشكيلة الأسطول كاملة.\n• أو اكتب لي مباشرة أي توجيه أو استفسار أو سؤال عميل للبدء فوراً!`;
    }

    if (text === '/agents' || lower === 'agents' || text === 'الوكلاء') {
        return `<b>تشكيلة أسطول الـ 14 وكيلاً في مواقعهم الميدانية:</b>\n\n` +
            `<b>🎯 ثلاثي الاستراتيجية والابتكار:</b>\n` +
            `1. ⚙️ <b>operator-agent</b>: انضباط العمليات ورسم مسارات التنفيذ (Runbooks)\n` +
            `2. 🥊 <b>challenger-agent</b>: فريق النقد (Red Team) وكشف المخاطر ونقاط الضعف\n` +
            `3. 💡 <b>innovator-agent</b>: الميزات التنافسية والابتكار العملي\n\n` +
            `<b>💻 التكنولوجيا والجودة:</b>\n` +
            `4. 💻 <b>developer-agent</b>: البرمجة الشاملة (Laravel, MySQL, Bootstrap, Android)\n` +
            `5. 🔍 <b>qa-agent</b>: تدقيق الأكواد، الأمان واختبارات الجودة\n\n` +
            `<b>🏢 العمليات والتجارة:</b>\n` +
            `6. 🎫 <b>ordering-agent</b>: دورة حياة التذاكر وحجز المقاعد\n` +
            `7. 💳 <b>accounting-agent</b>: الفواتير، الضرائب وبوابات الدفع\n` +
            `8. 🏪 <b>vendor-catalog-agent</b>: إدارة التجار وقوائم المنتجات والربط المباشر\n` +
            `9. 🛡️ <b>risk-fraud-agent</b>: مكافحة الاحتيال وتأمين العمليات\n` +
            `10. 📲 <b>logistics-dispatch-agent</b>: أكواد الدخول المشفرة (QR) والتحقق في البوابات\n` +
            `11. 🎧 <b>customer-support-agent</b>: خدمة العملاء والفرز وحل النزاعات\n\n` +
            `<b>📈 قنوات البيع والنمو:</b>\n` +
            `12. 📦 <b>amazon-seller-agent</b>: إدارة متجر أمازون ورفع المنتجات المعتمدة\n` +
            `13. 🎵 <b>social-media-agent</b>: سيناريوهات تيك توك والمحتوى الفيروسي\n` +
            `14. 📈 <b>marketing-agent</b>: تصدر محركات البحث (SEO) والمتاجر (ASO)\n\n` +
            `جاهزة لأمرك يا فندم.`;
    }

    // Attempt AI Generation
    const aiResponse = await queryAI(text, chatId);
    if (aiResponse) {
        addToHistory(chatId, 'user', text);
        addToHistory(chatId, 'assistant', aiResponse);
        return aiResponse;
    }

    // Informative fallback if no AI key is active yet
    return `<b>أهلاً بك يا فندم 👩‍💼</b>\n\nاستلمت رسالتك: <i>"${text}"</i>.\n\nلتفعيل عقل ليلى الذكي بالكامل للرد التفاعلي وحل استفسارات العملاء، نحتاج إلى إدخال مفتاح الذكاء الاصطناعي (Gemini أو Groq أو Anthropic) في إعدادات البيئة.\n\nبمجرد تفعيله، ستجيبك ليلى بدقة وتطرح الأسئلة التشخيصية المطلوبة فوراً.`;
}

// 🌐 Lightweight HTTP Health Server for Render (Keeps service active 24/7)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('👑 Layla Executive Cloud Bot is running 24/7 on Render!\nAll 14 agents online.');
});

server.listen(PORT, () => {
    console.log(`🌐 HTTP Health Server listening on port ${PORT}`);
});

// Stable Short-Polling Loop
let offset = 0;
async function pollLoop() {
    console.log('🤖 Layla Multilingual 14-Agent Cloud Bot is active with VIP Security & AI Engine...');

    while (true) {
        try {
            const data = await callTelegram('getUpdates', {
                offset: offset,
                timeout: 0
            });

            if (data && data.ok && Array.isArray(data.result)) {
                for (const update of data.result) {
                    offset = update.update_id + 1;

                    if (update.message && update.message.text) {
                        const chatId = update.message.chat.id;
                        const userText = update.message.text;
                        const senderName = update.message.from.first_name || 'User';

                        // 🔒 Security Check: Ignore unauthorized users
                        if (!isAuthorized(chatId)) {
                            console.log(`⛔ Unauthorized message from ${senderName} (${chatId}). Ignored.`);
                            continue;
                        }

                        console.log(`📩 Received message from ${senderName}: "${userText}"`);

                        // Send "typing..." status indicator on Telegram while thinking
                        await sendTypingAction(chatId);

                        const reply = await generateLaylaReply(userText, chatId);
                        const sendResult = await sendMessage(chatId, reply);
                        console.log(`📤 Reply sent to ${chatId}: success=${sendResult ? sendResult.ok : false}`);
                    }
                }
            }
        } catch (err) {
            // Ignore temporary connection resets
        }

        await new Promise(r => setTimeout(r, 1200));
    }
}

pollLoop();
