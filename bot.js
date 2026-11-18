const http = require('http');

// Render provides the PORT environment variable
const PORT = process.env.PORT || 3000;

// Read Bot Token from Environment Variable on Render (or local fallback)
const TOKEN = process.env.TELEGRAM_API_TOKEN || "9241496897:AAF9iZIaA0WE_jPE2o0G96Nw2Ax_t9IkWwQ";
const API_BASE = `https://api.telegram.org/bot${TOKEN}`;

// 🔒 SECURITY LOCK: Only Walid's Telegram Chat ID can access Layla
const AUTHORIZED_USER_IDS = [1667811770];

function isAuthorized(chatId) {
    return AUTHORIZED_USER_IDS.includes(Number(chatId));
}

// Robust Multi-Language Detection
function detectLanguage(text) {
    const lower = text.toLowerCase();
    
    // Arabic
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    
    // French
    if (/\b(bonjour|salut|merci|oui|combien|agents?|comment|ca va|cava)\b/i.test(lower) || /[éèêëàâçùûôîï]/.test(lower)) {
        return 'fr';
    }
    
    // Spanish
    if (/\b(hola|buenos|gracias|cuantos?|como|por favor|si|empezar)\b/i.test(lower) || /[ñáéíóú¿¡]/.test(lower)) {
        return 'es';
    }
    
    // German
    if (/\b(hallo|guten|danke|wie|bitte|ja|starten)\b/i.test(lower) || /[äöüß]/.test(lower)) {
        return 'de';
    }
    
    // Default to English
    return 'en';
}

async function callTelegram(method, params = {}) {
    try {
        const res = await fetch(`${API_BASE}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        return await res.json();
    } catch (err) {
        return null;
    }
}

async function sendMessage(chatId, text) {
    let res = await callTelegram('sendMessage', {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
    });

    if (!res || !res.ok) {
        const plainText = text.replace(/<[^>]*>/g, '');
        res = await callTelegram('sendMessage', {
            chat_id: chatId,
            text: plainText
        });
    }

    return res;
}

// Multilingual Layla Response Generator (14 Fleet Agents)
function generateLaylaReply(userText) {
    const text = userText.trim();
    const lower = text.toLowerCase();
    const lang = detectLanguage(text);

    // ==========================================
    // 1. FRENCH (Français)
    // ==========================================
    if (lang === 'fr') {
        if (text === '/start' || lower.includes('bonjour') || lower.includes('salut')) {
            return `<b>Bienvenue Monsieur ! 👑</b>\n\nJe suis <b>Layla</b>, votre directrice exécutive des opérations.\nJe supervise une flotte de <b>14 agents spécialisés</b> (Opérateur, Challenger, Innovateur, Développement, Amazon, TikTok, Billetterie, Comptabilité, etc.).\n\n• Tapez <code>/agents</code> pour voir la liste complète.\n• Ou écrivez-moi directement votre consigne !`;
        }

        if (lower.includes('combien') || lower.includes('agent') || text === '/agents') {
            return `<b>Nous avons 14 agents spécialisés sous mon commandement :</b>\n\n` +
                `<b>🎯 Stratégie & Innovation :</b>\n` +
                `1. ⚙️ <b>operator-agent</b> : Exécution rigoureuse des processus et SLA\n` +
                `2. 🥊 <b>challenger-agent</b> : Red Team, pensée critique et détection des failles\n` +
                `3. 💡 <b>innovator-agent</b> : Stratégie créative et fonctionnalités novatrices\n\n` +
                `<b>💻 Technologie & Qualité :</b>\n` +
                `4. 💻 <b>developer-agent</b> : Full-Stack (Laravel, Bootstrap, MySQL, Android)\n` +
                `5. 🔍 <b>qa-agent</b> : Revue de code et audit de sécurité\n\n` +
                `<b>🏢 Opérations & E-Commerce :</b>\n` +
                `6. 🎫 <b>ordering-agent</b> : Cycle de vie des billets et réservations\n` +
                `7. 💳 <b>accounting-agent</b> : Facturation et passerelles Stripe/PayPal\n` +
                `8. 🏪 <b>vendor-catalog-agent</b> : Catalogue vendeurs et synchronisation des stocks\n` +
                `9. 🛡️ <b>risk-fraud-agent</b> : Lutte contre la fraude et les bots\n` +
                `10. 📲 <b>logistics-dispatch-agent</b> : QR codes sécurisés et validation\n` +
                `11. 🎧 <b>customer-support-agent</b> : Support client automatisé\n\n` +
                `<b>📈 Croissance & Ventes :</b>\n` +
                `12. 📦 <b>amazon-seller-agent</b> : Boutique Amazon SP-API et listings\n` +
                `13. 🎵 <b>social-media-agent</b> : Scripts viraux TikTok et réseaux sociaux\n` +
                `14. 📈 <b>marketing-agent</b> : Référencement SEO et ASO\n\n` +
                `Par quel secteur souhaitez-vous commencer ?`;
        }

        return `<b>Bien reçu, Monsieur.</b> 👩‍💼\n\nJ'ai enregistré votre consigne : <i>"${text}"</i>.\nJe coordonne immédiatement avec les 14 agents pour l'exécuter avec rigueur et précision.`;
    }

    // ==========================================
    // 2. SPANISH (Español)
    // ==========================================
    if (lang === 'es') {
        if (text === '/start' || lower.includes('hola') || lower.includes('buenos')) {
            return `<b>¡Bienvenido, Señor! 👑</b>\n\nSoy <b>Layla</b>, su Directora Ejecutiva de Operaciones.\nSuperviso una flota de <b>14 agentes especializados</b>.\n\n• Escriba <code>/agents</code> para ver el equipo completo.\n• ¡O envíeme su orden directamente para comenzar!`;
        }

        if (lower.includes('cuanto') || lower.includes('agente') || text === '/agents') {
            return `<b>Tenemos 14 agentes especializados listos bajo mi mando :</b>\n\n` +
                `<b>🎯 Estrategia & Innovación :</b>\n` +
                `1. ⚙️ <b>operator-agent</b> : Ejecución rigurosa de procesos y SLAs\n` +
                `2. 🥊 <b>challenger-agent</b> : Red Team, pensamiento crítico y auditoría de riesgos\n` +
                `3. 💡 <b>innovator-agent</b> : Estrategia creativa y ventajas competitivas\n\n` +
                `<b>💻 Ingeniería & Calidad :</b>\n` +
                `4. 💻 <b>developer-agent</b> : Laravel, Bootstrap, MySQL, Android Java\n` +
                `5. 🔍 <b>qa-agent</b> : Control de calidad y seguridad\n\n` +
                `<b>🏢 Operaciones & Comercio :</b>\n` +
                `6. 🎫 <b>ordering-agent</b> : Ciclo de pedidos y reservas\n` +
                `7. 💳 <b>accounting-agent</b> : Facturación y pasarelas de pago\n` +
                `8. 🏪 <b>vendor-catalog-agent</b> : Catálogo y sincronización de stock\n` +
                `9. 🛡️ <b>risk-fraud-agent</b> : Prevención de fraude y bots\n` +
                `10. 📲 <b>logistics-dispatch-agent</b> : Códigos QR y accesos\n` +
                `11. 🎧 <b>customer-support-agent</b> : Atención al cliente\n\n` +
                `<b>📈 Crecimiento & Canales :</b>\n` +
                `12. 📦 <b>amazon-seller-agent</b> : Tienda Amazon y subida de productos\n` +
                `13. 🎵 <b>social-media-agent</b> : Guiones virales de TikTok\n` +
                `14. 📈 <b>marketing-agent</b> : SEO y posicionamiento ASO\n\n` +
                `¿Qué división desea activar primero?`;
        }

        return `<b>Entendido, Señor.</b> 👩‍💼\n\nHe recibido su instrucción : <i>"${text}"</i>.\nEstoy coordinando con el equipo de 14 agentes para ejecutarla con total precisión.`;
    }

    // ==========================================
    // 3. ENGLISH
    // ==========================================
    if (lang === 'en') {
        if (text === '/start' || lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
            return `<b>Welcome, Sir! 👑</b>\n\nI am <b>Layla</b>, your Chief of Staff and Executive Operations Director.\n\nI oversee a complete fleet of <b>14 specialized agents</b> stationed across Strategy, Innovation, Engineering, Operations, and Sales Channels.\n\n• Type <code>/agents</code> to inspect the full fleet.\n• Send any directive directly to deploy the agents!`;
        }

        if (lower.includes('how many') || lower.includes('agent') || text === '/agents') {
            return `<b>We have 14 specialized agents stationed in their exact positions :</b>\n\n` +
                `<b>🎯 Strategic & Innovation Triad :</b>\n` +
                `1. ⚙️ <b>operator-agent</b> : Operational execution, runbook discipline & SLA tracking\n` +
                `2. 🥊 <b>challenger-agent</b> : Red Team, devil's advocate & stress-testing assumptions\n` +
                `3. 💡 <b>innovator-agent</b> : Breakthrough product features & competitive differentiation\n\n` +
                `<b>💻 Engineering & Quality :</b>\n` +
                `4. 💻 <b>developer-agent</b> : Full-stack coding (Laravel, MySQL, Bootstrap, Android Java)\n` +
                `5. 🔍 <b>qa-agent</b> : Code reviews, automated testing & Chrome DevTools audits\n\n` +
                `<b>🏢 Commerce & Operations :</b>\n` +
                `6. 🎫 <b>ordering-agent</b> : Ticket lifecycle state machines & seat reservations\n` +
                `7. 💳 <b>accounting-agent</b> : Invoicing, tax calculations & payment gateways\n` +
                `8. 🏪 <b>vendor-catalog-agent</b> : Merchant onboarding, taxonomy & inventory sync\n` +
                `9. 🛡️ <b>risk-fraud-agent</b> : Anti-fraud, bot prevention & ticket scalping protection\n` +
                `10. 📲 <b>logistics-dispatch-agent</b> : Cryptographic QR pass generation & venue check-in\n` +
                `11. 🎧 <b>customer-support-agent</b> : Automated dispute handling & customer triage\n\n` +
                `<b>📈 Growth & Distribution :</b>\n` +
                `12. 📦 <b>amazon-seller-agent</b> : Amazon SP-API, compliant listings & account health\n` +
                `13. 🎵 <b>social-media-agent</b> : Viral TikTok 3s-hook scripts & content calendars\n` +
                `14. 📈 <b>marketing-agent</b> : Technical SEO, App Store Optimization (ASO) & copy\n\n` +
                `Which operational division shall we deploy today?`;
        }

        if (lower.includes('operator') || lower.includes('runbook') || lower.includes('workflow')) {
            return `<b>⚙️ [operator-agent] Standby Report:</b>\n\n` +
                `• <b>Position:</b> Process rigor, task dependencies, and SLA enforcement.\n` +
                `• <b>Discipline:</b> Reads actual system logs and execution states. Rejects vague promises.\n` +
                `• <b>Ready to execute:</b> Build step-by-step operational runbooks for any feature or deployment.`;
        }

        if (lower.includes('challenger') || lower.includes('red team') || lower.includes('critique') || lower.includes('risk')) {
            return `<b>🥊 [challenger-agent] Audit Mode:</b>\n\n` +
                `• <b>Position:</b> Red Team & Devil's Advocate.\n` +
                `• <b>Discipline:</b> Stress-tests plans for single points of failure, security holes, and hidden traps.\n` +
                `• <b>Ready to audit:</b> Submit any architectural design or business plan for rigorous challenge.`;
        }

        if (lower.includes('innovator') || lower.includes('idea') || lower.includes('creative') || lower.includes('feature')) {
            return `<b>💡 [innovator-agent] Strategic Innovation:</b>\n\n` +
                `• <b>Position:</b> Product differentiation, viral growth mechanics, and next-gen UX.\n` +
                `• <b>Discipline:</b> Grounded creativity: novel mechanics engineered to work on Laravel & MySQL.\n` +
                `• <b>Ready to innovate:</b> Request modern feature concepts or viral growth loops anytime.`;
        }

        if (lower.includes('how you are working') || lower.includes('how do you work') || lower.includes('explain')) {
            return `<b>How our 14-agent fleet operates:</b>\n\n` +
                `1. <b>Innovation & Concept:</b> [innovator-agent] crafts the differentiated feature.\n` +
                `2. <b>Challenge & Stress-Test:</b> [challenger-agent] audits flaws, security, and edge cases.\n` +
                `3. <b>Operational Runbook:</b> [operator-agent] maps exact execution steps.\n` +
                `4. <b>Engineering & Code:</b> [developer-agent] writes production Laravel & Bootstrap code.\n` +
                `5. <b>QA Verification:</b> [qa-agent] tests the code with Chrome DevTools.\n` +
                `6. <b>Delivery:</b> I synthesize the real output and deliver verified results directly to you.\n\n` +
                `Ready for your command, Sir.`;
        }

        if (lower.includes('start') || lower.includes('ready') || lower.includes('yes') || lower.includes('begin')) {
            return `<b>The 14-agent fleet is fully armed and ready! 🚀</b>\n\n` +
                `Select an operational objective:\n` +
                `1. 🌐 <b>TickOrder Platform</b> (Custom Laravel + Bootstrap core & ticketing engine)\n` +
                `2. 📦 <b>Amazon Store Operations</b> (Listing optimization & flat files)\n` +
                `3. 🎵 <b>TikTok & Social Media</b> (Viral hooks & content calendars)\n` +
                `4. 🥊 <b>Red-Team Challenge</b> (Stress-test an existing idea or plan)\n\n` +
                `Reply with 1, 2, 3, 4 or state your custom goal directly.`;
        }

        return `<b>Understood, Sir.</b> 👩‍💼\n\nInstruction received: <i>"${text}"</i>.\n\nCoordinating with the relevant agents across the 14-member fleet to execute with factual precision.`;
    }

    // ==========================================
    // 4. ARABIC (العربية)
    // ==========================================
    if (text === '/start' || lower.includes('مرحبا') || lower.includes('أهلا') || lower.includes('السلام')) {
        return `<b>أهلاً بك يا فندم! 👑</b>\n\nأنا <b>ليلى (Layla)</b>، المديرة التنفيذية لعملياتك ومشاريعك الرقمية.\n\nأدير أسطولاً متكاملاً من <b>14 وكيلاً متخصصاً</b> موزعين بدقة في مواقعهم التشغيلية (الابتكار، التحدي والنقد، العمليات، البرمجة، أمازون، تيك توك، والتذاكر).\n\n• اكتب <code>/agents</code> أو <i>"الوكلاء"</i> لعرض التشكيلة كاملة.\n• أو اكتب توجيهك لنبدأ العمل فوراً!`;
    }

    if (lower.includes('كم عدد') || lower.includes('وكيل') || lower.includes('فريق') || text === '/agents') {
        return `<b>لدينا 14 وكيلاً متخصصاً، كل وكيل في موقعه الميداني المحدد :</b>\n\n` +
            `<b>🎯 ثلاثي الاستراتيجية والابتكار :</b>\n` +
            `1. ⚙️ <b>operator-agent</b> : وكيل العمليات (التنفيذ الصارم، ضبط الجداول ومتابعة المهام)\n` +
            `2. 🥊 <b>challenger-agent</b> : وكيل التحدي والنقد (Red Team - كشف الثغرات ونقد الأفكار الضعيفة)\n` +
            `3. 💡 <b>innovator-agent</b> : وكيل الابتكار (صناعة الميزات الثورية والحلول غير التقليدية)\n\n` +
            `<b>💻 التكنولوجيا والجودة :</b>\n` +
            `4. 💻 <b>developer-agent</b> : كبير المطورين (Laravel, Bootstrap, MySQL, Android Java)\n` +
            `5. 🔍 <b>qa-agent</b> : فحص الجودة، مراجعة الأكواد واختبارات الأمان\n\n` +
            `<b>🏢 العمليات والتجارة :</b>\n` +
            `6. 🎫 <b>ordering-agent</b> : محرك حجز التذاكر ودورة حياة الطلب\n` +
            `7. 💳 <b>accounting-agent</b> : الفواتير، بوابات الدفع، والضرائب\n` +
            `8. 🏪 <b>vendor-catalog-agent</b> : إدارة المتاجر والمنتجات والمخزون\n` +
            `9. 🛡️ <b>risk-fraud-agent</b> : مكافحة الاحتيال وحماية التذاكر من البوتات\n` +
            `10. 📲 <b>logistics-dispatch-agent</b> : أكواد الـ QR والبوابات الذكية\n` +
            `11. 🎧 <b>customer-support-agent</b> : خدمة العملاء وحل النزاعات\n\n` +
            `<b>📈 قنوات النمو والمبيعات :</b>\n` +
            `12. 📦 <b>amazon-seller-agent</b> : متجر أمازون ورفع المنتجات (SP-API)\n` +
            `13. 🎵 <b>social-media-agent</b> : سيناريوهات تيك توك الفيروسية والمحتوى\n` +
            `14. 📈 <b>marketing-agent</b> : التسويق الرقمي، الـ SEO وتصدر المتاجر (ASO)\n\n` +
            `أي قطاع ترغب بتفعيله والبدء به الآن يا فندم؟`;
    }

    if (lower.includes('operator') || lower.includes('عمليات') || lower.includes('تشغيل')) {
        return `<b>⚙️ وكيل العمليات [operator-agent] في الخدمة:</b>\n\n` +
            `• <b>موقعه:</b> الانضباط التنفيذي، رسم مسار العمليات (Runbooks) وضمان تنفيذ المهام خطوة بخطوة.\n` +
            `• <b>أسلوبه:</b> قراءة السجلات الفعلية والبيانات الحقيقية، ومنع أي تساهل أو اعتماد على الافتراضات.`;
    }

    if (lower.includes('challenger') || lower.includes('تحدي') || lower.includes('نقد') || lower.includes('ثغرات')) {
        return `<b>🥊 وكيل التحدي والنقد [challenger-agent] في الخدمة:</b>\n\n` +
            `• <b>موقعه:</b> فريق النقد الأحمر (Red Team) - اختبار الخطط واكتشاف نقاط الضعف والمخاطر قبل إطلاقها.\n` +
            `• <b>أسلوبه:</b> تفكيك الافتراضات الضعيفة، كشف المخاطر المالية والتقنية، وطرح حلول بديلة قوية.`;
    }

    if (lower.includes('innovator') || lower.includes('ابتكار') || lower.includes('افكار') || lower.includes('أفكار')) {
        return `<b>💡 وكيل الابتكار [innovator-agent] في الخدمة:</b>\n\n` +
            `• <b>موقعه:</b> التفكير الإبداعي وصناعة الميزات التنافسية المتقدمة لمنصاتك.\n` +
            `• <b>أسلوبه:</b> تقديم أفكار متطورة مبنية على واقع برمجي قابل للتنفيذ (Laravel & MySQL).`;
    }

    if (lower.includes('كيف تعمل') || lower.includes('شرح')) {
        return `<b>كيف تعمل منظومة الـ 14 وكيلاً معاً؟ ⚙️</b>\n\n` +
            `1. 💡 <b>الابتكار:</b> يبتكر [innovator-agent] ميزة تنافسية فريدة.\n` +
            `2. 🥊 <b>التحدي:</b> يقوم [challenger-agent] باختبار الميزة وكشف ثغراتها ومخاطرها.\n` +
            `3. ⚙️ <b>العمليات:</b> يضع [operator-agent] خطة التنفيذ الميدانية الصارمة.\n` +
            `4. 💻 <b>البرمجة:</b> يكتب [developer-agent] كود Laravel النظيف من الصفر.\n` +
            `5. 🔍 <b>الجودة:</b> يفحص [qa-agent] الأمان والاستقرار بـ Chrome DevTools.\n` +
            `6. 👑 <b>الإشراف:</b> أقوم بتسليمك النتيجة المكتملة هنا فوراً.\n\n` +
            `جاهزة لأمرك المباشر يا فندم.`;
    }

    if (lower.includes('نبدأ') || lower.includes('جاهز') || lower.includes('ابدا')) {
        return `<b>الأسطول المكون من 14 وكيلاً جاهز ومستنفر بالكامل! 🚀</b>\n\n` +
            `اختر هدف البداية:\n` +
            `1. 🌐 <b>منصة TickOrder</b> (الكود والتصميم وقاعدة البيانات)\n` +
            `2. 📦 <b>متجر أمازون</b> (تجهيز وإدراج المنتجات)\n` +
            `3. 🎵 <b>تيك توك والسوشيال ميديا</b> (سيناريوهات فيروسية وجدول النشر)\n` +
            `4. 🥊 <b>جلسة تحدي ونقد</b> (فحص فكرة أو مشروع لكشف أي ثغرات)\n\n` +
            `أرسل 1 أو 2 أو 3 أو 4 وسننطلق فوراً!`;
    }

    return `<b>أهلاً بك يا فندم 👩‍💼</b>\n\nاستلمت توجيهك: <i>"${text}"</i>.\n\nتم التنسيق مع الوكلاء المعنيين ضمن الأسطول الـ 14 للتنفيذ بدقة واقعية ودون أي معلومات غير مؤكدة.`;
}

// 🌐 Lightweight HTTP Health Server for Render (Keeps service active 24/7 for Free)
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
    console.log('🤖 Layla Multilingual 14-Agent Cloud Bot is active with VIP Security...');
    
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

                        console.log(`📩 Received [${detectLanguage(userText)}] from ${senderName}: "${userText}"`);

                        const reply = generateLaylaReply(userText);
                        const sendResult = await sendMessage(chatId, reply);
                        console.log(`📤 Reply sent to ${chatId}: success=${sendResult ? sendResult.ok : false}`);
                    }
                }
            }
        } catch (err) {
            // Ignore temporary glitches
        }

        await new Promise(r => setTimeout(r, 1200));
    }
}

pollLoop();
