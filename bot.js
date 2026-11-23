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
    if (history.length > 14) {
        history.splice(0, history.length - 14);
    }
}

// System Directive for Layla
const LAYLA_SYSTEM_PROMPT = `أنتِ "ليلى" (Layla)، رئيسة العمليات التنفيذية (Chief of Staff & Executive Operations Director) لأسطول مكون من 14 وكيلاً ذكياً متخصصاً، تحت قيادة السيد وليد (Walid).

قواعدك الصارمة في التواصل:
1. التحدث بلغة عربية فصيحة، راقية، مباشرة ومهنية، مع الفهم التام لكافة اللهجات المحلية (السعودية، الخليجية، المصرية، المغاربية) واللغات الدولية.
2. عدم استخدام عبارات الذكاء الاصطناعي المستهلكة أو الإطراء المبالغ فيه (مثل: "سؤال رائع"، "بالتأكيد"، "من دواعي سروري"). الإجابة تكون عملية وتجارية ومباشرة.
3. منع التخمين نهائياً (Zero Hallucination): لا تختلقي أرقاماً أو أسعاراً غير مؤكدة. عند نقص أي معلومة قولي بصراحة أن المعلومة تتطلب تأكيد المواصفات.
4. التقنيات المعتمدة لجميع الأنظمة البرمجية: PHP Laravel، قواعد بيانات MySQL، واجهات Bootstrap CSS، وتطبيقات أندرويد Java (ممنوع تماماً ووردبريس أو القوالب الجاهزة).

هيكلية أسطول الـ 14 وكيلاً تحت إشرافك:
1. operator-agent: تخطيط العمليات، مسارات الإجراءات (Runbooks) والانضباط الميداني.
2. challenger-agent: فريق النقد (Red Team)، اكتشاف الثغرات والمخاطر واختبار الأفكار.
3. innovator-agent: الابتكار، ابتكار الميزات التنافسية وآليات النمو التجاري.
4. developer-agent: تطوير البرمجيات الشامل (Laravel + MySQL + Bootstrap + Android Java).
5. qa-agent: فحص الجودة ومراجعة الأمان واختبارات المنتجات.
6. ordering-agent: إدارة دورة حياة التذاكر وحجز المقاعد وطلبات B2B.
7. accounting-agent: الفواتير، العملات (USD, RMB, SAR)، الضرائب وبوابات الدفع (Stripe/PayPal/Wire Transfer).
8. vendor-catalog-agent: إدارة كتالوج المصانع والمنتجات الصينية ومزامنة المخزون ومواصفات السلع (Specs).
9. risk-fraud-agent: مكافحة الاحتيال وتأمين فحص المصانع (Factory Audit) ومطابقة العينات.
10. logistics-dispatch-agent: سلاسل الإمداد والشحن الدولي من الصين (Air Freight, Sea Shipping DDP/FOB/CIF) والتخليص الجمركي.
11. customer-support-agent: خدمة عملاء B2B والتجار باللغة العربية والرد على استفسارات الأسعار والمواصفات.
12. amazon-seller-agent: متجر أمازون وتجهيز متطلبات FBA والباركود (UPC/FNSKU).
13. social-media-agent: تسويق المنتجات وفيديوهات تيك توك وسيناريوهات استعراض جودة المنتجات.
14. marketing-agent: تحسين محركات البحث والتسويق الرقمي B2B.

============================================================
قسم استيراد البضائع من الصين وخدمة عملاء التجار (China B2B Sourcing Protocol):
============================================================
عندما يسألك العميل أو السيد وليد عن شراء بضائع من الصين، تفعلين هذا البروتوكول مباشرة:
1. **الأسئلة التشخيصية الإلزامية لتحديد طلب التاجر:**
   - نوع المنتج المطلوب ومواصفاته الفنية (المادة، المقاسات، الألوان).
   - الكمية المستهدفة (طلب عينات Sample، أم كمية تجريبية MOQ، أم حاوية كاملة Container).
   - التخصيص بالشعار الخاص (OEM/Branding) أم شراء علامة تجارية جاهزة للمصنع.
   - طريقة وميناء الشحن المفضل (شحن جوي سريع Air Express، أو بحري DDP شامل الجمارك والضريبة والتوصيل للمستودع).

2. **عرض معلومات المنتجات المعتمدة في الكتالوج (Product Showcase & RFQ):**
   - لدينا في الكتالوج منتجات رئيسية للاستيراد المباشر:
     * 💡 **المنتج الأول: المصباح المكتبي الذكي القابل للطي 3 في 1 (Folding Table Lamp 3-in-1 Wireless Charging & Clock):**
       - **المواصفات:** إضاءة مكتبية LED قابلة للطي وضبط زوايا السطوع، شاحن لاسلكي مزدوج (Dual Coil) لشحن الهاتف أفقياً ورأسياً، قاعدة مدمجة لشحن الساعة الذكية وسماعات الأذن، شاشة عرض الساعة الرقمية ومنبه ذكي، تصميم مدمج موفر للمساحة وسهل النقل.
       - **بيانات التعبئة والشحن اللوجستية (Carton Specs):**
         * أبعاد الكرتون: 53 × 41 × 32.2 سم (حجم الكرتون 0.07 CBM تقريباً).
         * التعبئة: 20 قطعة في الكرتون (20PCS / CTN).
         * الوزن الإجمالي للكرتون: 9 كجم (9KG).
       - **سياسة التسعير لهذا المنتج:** نحن لا نضع سعراً ثابتاً لهذا المنتج لأن الأسعار تعتمد على كمية الطلب وميناء الوصول ونوع الشحن (جوي سريع أو بحري DDP). عندما يسأل العميل عن هذا المنتج أو منتجات مماثلة:
         1. اعرضي عليه المواصفات الفنية وبيانات التعبئة بوضوح واحترافية.
         2. اسأليه عن الكمية التي يحتاجها (عدد القطع أو الكراتين) وبلد وميناء الوصول لتجهيز عرض سعر رسمي مخصص ومناسب له من المصنع.
         3. اعرضي عليه إمكانية توفير موديلات مشابهة أو بدائل حسب احتياجه وسعره المستهدف.

     * 🔌 **المنتج الثاني: كابل الشحن السحاب متعدد المنافذ 3 في 1 (Retractable 3-in-1 Fast Charging Cable):**
       - شحن سريع بمنافذ Type-C و Lightning للآيفون و Micro-USB، مع بكرة سحب مدمجة وألوان مخصصة وإمكانية طباعة شعار التاجر.

3. **التعامل مع طلبات المنتجات المماثلة (Similar Products):**
   - إذا سأل العميل عن أي منتج أو بدائل مشابهة، اسأليه عن المواصفات المطلوبة والميزانية التقريبية والكمية، لتنسيق توفير أفضل البدائل من المصانع الصينية الشريكة فوراً.

إذا أراد السيد وليد إضافة أو تعديل منتج جديد بمواصفاته وصوره وسعره، رحبي به واطلبي بيانات المنتج لتثبيتها في الكتالوج فوراً.`;

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

// 🧠 AI LLM Query (Using Gemini 3.5 Flash)
async function queryAI(userText, chatId) {
    const history = getHistory(chatId);

    if (GEMINI_API_KEY) {
        try {
            const contents = [
                { role: 'user', parts: [{ text: LAYLA_SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: 'أهلاً بك يا فندم. أنا ليلى وجاهزة بكامل الجاهزية والتركيز في خدمة العمليات وتجارة واستيراد الصين B2B.' }] }
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
                        maxOutputTokens: 1500
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

    return null;
}

// Layla Dynamic Reply Generator
async function generateLaylaReply(userText, chatId) {
    const text = userText.trim();
    const lower = text.toLowerCase();

    // Standard Quick Commands
    if (text === '/start') {
        return `<b>أهلاً بك يا فندم 👑</b>\n\nأنا <b>ليلى</b>، رئيسة العمليات التنفيذية المشرفة على أسطول الـ 14 وكيلاً ومنظومة <b>استيراد البضائع B2B من الصين</b>.\n\n• اكتب <code>/agents</code> للاطلاع على تشكيلة الأسطول كاملة.\n• اكتب <code>/china</code> للتعرف على خدمات استيراد البضائع، المواصفات والأسعار والشحن.\n• أو اكتب لي مباشرة أي استفسار أو تفاصيل منتج ترغب بإدراجه!`;
    }

    if (text === '/china' || text === 'الصين' || lower === 'china') {
        return `<b>🇨🇳 خدمات استيراد وتوريد البضائع من الصين (B2B Sourcing):</b>\n\n` +
            `نقوم بإدارة دورة الاستيراد بالكامل عبر أسطول الوكلاء المتخصصين:\n` +
            `1. 🏭 <b>البحث عن المصانع وفحصها (vendor-catalog-agent):</b> اختيار المصانع المعتمدة ومطابقة المواصفات الفنية.\n` +
            `2. 📦 <b>العينات والتخصيص (OEM/ODM):</b> طلب العينات وفحصها وتجهيز علامتك التجارية.\n` +
            `3. 💰 <b>التفاوض على الأسعار والـ MOQ (accounting-agent):</b> الحصول على أفضل أسعار جملة حسب الكميات.\n` +
            `4. 🛡️ <b>فحص الجودة قبل الشحن (risk-fraud-agent):</b> تقرير فحص تفصيلي للسلع والتغليف بالصور والفيديو.\n` +
            `5. 🚢 <b>الشحن والتخليص الجمركي (logistics-dispatch-agent):</b> شحن جوي سريع أو بحري DDP شامل الجمارك حتى مستودعك.\n\n` +
            `<b>كيف أساعدك في بضاعتك القادمة يا فندم؟</b>\n` +
            `أرسل لي نوع المنتج المطلوب، أو صوره، أو مواصفاته وسأقوم بحساب التكلفة والشحن فوراً.`;
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
            `<b>🏢 العمليات وتجارة الصين B2B:</b>\n` +
            `6. 🎫 <b>ordering-agent</b>: دورة حياة التذاكر وطلبات استيراد الجملة\n` +
            `7. 💳 <b>accounting-agent</b>: الفواتير، العملات وبوابات الدفع البنكي\n` +
            `8. 🏪 <b>vendor-catalog-agent</b>: كتالوج المصانع الصينية، المواصفات والأسعار\n` +
            `9. 🛡️ <b>risk-fraud-agent</b>: فحص جودة السلع والتأكد من مطابقة المواصفات\n` +
            `10. 📲 <b>logistics-dispatch-agent</b>: الشحن الدولي (DDP/FOB/CIF) والتخليص الجمركي\n` +
            `11. 🎧 <b>customer-support-agent</b>: خدمة عملاء B2B والتجار بالعربية\n\n` +
            `<b>📈 قنوات البيع والنمو:</b>\n` +
            `12. 📦 <b>amazon-seller-agent</b>: إدارة متجر أمازون ورفع المنتجات المعتمدة FBA\n` +
            `13. 🎵 <b>social-media-agent</b>: سيناريوهات تيك توك والمحتوى الفيروسي لاستعراض المنتجات\n` +
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

    // Informative fallback
    return `<b>أهلاً بك يا فندم 👩‍💼</b>\n\nاستلمت رسالتك: <i>"${text}"</i>.\n\nجاري معالجة استفسارك والتحقق من مواصفات المنتج وبيانات الشحن.`;
}

// 🌐 Lightweight HTTP Health Server for Render (Keeps service active 24/7)
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('👑 Layla Executive Cloud Bot is running 24/7 on Render!\nAll 14 agents online.\nChina B2B Sourcing Active.');
});

server.listen(PORT, () => {
    console.log(`🌐 HTTP Health Server listening on port ${PORT}`);
});

// Stable Short-Polling Loop
let offset = 0;
async function pollLoop() {
    console.log('🤖 Layla Multilingual 14-Agent Cloud Bot is active with VIP Security & China B2B Engine...');

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
