/**
 * Agent spoken lines per language. The selected language is handed to the
 * ElevenLabs agent config (agentLocale) and mirrors what the agent says.
 */

export interface CaptureCopy {
  agentName: string;
  status: string;
  questions: string[];
  answers: string[];
  events: string[];
}

export interface MapCopy {
  debriefQuestions: string[];
  teachBack: string;
  confirm: string;
}

export interface TeachCopy {
  tutorialGreeting: string;
  coaching: string[];
  guardrailAlert: string;
  masteryNote: string;
}

const capture: Record<string, CaptureCopy> = {
  en: {
    agentName: "Mira · Voice agent",
    status: "Listening",
    questions: [
      "I see you opened invoice 4471 — why this one first?",
      "You changed the cost center from 4711 to 0400. What's the reason?",
      "The amount is $12,400. Is there a limit where you'd stop and ask someone?",
    ],
    answers: [
      "It's the oldest in the batch — due Friday.",
      "Marketing owns this vendor's contract this quarter.",
      "Anything above $10,000 — I always check with the manager first.",
    ],
    events: ["invoice 4471 opened", "cost center 4711 → 0400", "amount $12,400 read"],
  },
  de: {
    agentName: "Mira · Sprachagent",
    status: "Hört zu",
    questions: [
      "Ich sehe, du hast Rechnung 4471 geöffnet — warum zuerst diese?",
      "Du hast die Kostenstelle von 4711 auf 0400 geändert. Was ist der Grund?",
      "Der Betrag ist 12.400 $. Gibt es eine Grenze, ab der du jemanden fragst?",
    ],
    answers: [
      "Sie ist die älteste im Stapel — fällig am Freitag.",
      "Marketing besitzt den Vertrag dieses Lieferanten in diesem Quartal.",
      "Alles über 10.000 $ — ich frage immer zuerst die Leitung.",
    ],
    events: ["Rechnung 4471 geöffnet", "Kostenstelle 4711 → 0400", "Betrag 12.400 $ gelesen"],
  },
  es: {
    agentName: "Mira · Agente de voz",
    status: "Escuchando",
    questions: [
      "Veo que abriste la factura 4471 — ¿por qué esta primero?",
      "Cambiaste el centro de costos de 4711 a 0400. ¿Cuál es la razón?",
      "El importe es 12.400 $. ¿Hay un límite donde pararías y preguntarías?",
    ],
    answers: [
      "Es la más antigua del lote — vence el viernes.",
      "Marketing posee el contrato de este proveedor este trimestre.",
      "Todo lo que supere 10.000 $ — siempre consulto primero al gerente.",
    ],
    events: ["factura 4471 abierta", "centro de costos 4711 → 0400", "importe 12.400 $ leído"],
  },
  fr: {
    agentName: "Mira · Agent vocal",
    status: "À l'écoute",
    questions: [
      "Je vois que vous avez ouvert la facture 4471 — pourquoi celle-ci d'abord ?",
      "Vous avez changé le centre de coûts de 4711 à 0400. Quelle est la raison ?",
      "Le montant est de 12 400 $. Y a-t-il une limite où vous vous arrêteriez pour demander ?",
    ],
    answers: [
      "C'est la plus ancienne du lot — échéance vendredi.",
      "Le marketing détient le contrat de ce fournisseur ce trimestre.",
      "Tout ce qui dépasse 10 000 $ — je demande toujours au responsable d'abord.",
    ],
    events: ["facture 4471 ouverte", "centre de coûts 4711 → 0400", "montant 12 400 $ lu"],
  },
  ja: {
    agentName: "Mira · 音声エージェント",
    status: "聞き取り中",
    questions: [
      "請求書4471を開きましたね — なぜこれを最初に？",
      "コストセンターを4711から0400に変更しました。理由は？",
      "金額は$12,400です。誰かに確認する上限はありますか？",
    ],
    answers: [
      "バッチで最も古いものです — 金曜日が期限です。",
      "この四半期、マーケティングがこのベンダーの契約を保有しています。",
      "$10,000を超えるものは — 必ず先にマネージャーに確認します。",
    ],
    events: ["請求書4471を開封", "コストセンター 4711 → 0400", "金額 $12,400 を読み取り"],
  },
  pt: {
    agentName: "Mira · Agente de voz",
    status: "Ouvindo",
    questions: [
      "Vejo que você abriu a fatura 4471 — por que esta primeiro?",
      "Você mudou o centro de custos de 4711 para 0400. Qual o motivo?",
      "O valor é $12.400. Há um limite em que você pararia e perguntaria a alguém?",
    ],
    answers: [
      "É a mais antiga do lote — vence sexta-feira.",
      "O marketing detém o contrato deste fornecedor neste trimestre.",
      "Tudo acima de $10.000 — sempre confirmo com o gerente primeiro.",
    ],
    events: ["fatura 4471 aberta", "centro de custos 4711 → 0400", "valor $12.400 lido"],
  },
  zh: {
    agentName: "Mira · 语音助手",
    status: "正在聆听",
    questions: [
      "我看到你打开了发票 4471，为什么先处理这一张？",
      "你把成本中心从 4711 改为 0400，原因是什么？",
      "金额是 $12,400。达到什么限额时你会暂停并请示他人？",
    ],
    answers: [
      "这是这一批中最早的一张，周五到期。",
      "本季度由市场部负责这家供应商的合同。",
      "任何超过 $10,000 的款项，我都会先请经理确认。",
    ],
    events: ["已打开发票 4471", "成本中心 4711 → 0400", "已读取金额 $12,400"],
  },
};

const map: Record<string, MapCopy> = {
  en: {
    debriefQuestions: [
      "When would you reject invoice 4471 instead of booking it?",
      "Who do you ask when the amount is over $10,000?",
      "What do you check before you press save?",
    ],
    teachBack:
      "So the process is: open the oldest invoice first, book it to the cost center that owns the vendor's contract, and stop to ask the manager whenever the amount passes $10,000. Did I get that right?",
    confirm: "Confirmed — that's exactly how I do it.",
  },
  de: {
    debriefQuestions: [
      "Wann würdest du Rechnung 4471 ablehnen statt sie zu buchen?",
      "Wen fragst du, wenn der Betrag über 10.000 $ liegt?",
      "Was prüfst du, bevor du auf Speichern drückst?",
    ],
    teachBack:
      "Der Ablauf ist also: die älteste Rechnung zuerst öffnen, auf die Kostenstelle buchen, die den Lieferantenvertrag besitzt, und immer die Leitung fragen, wenn der Betrag über 10.000 $ liegt. Habe ich das richtig verstanden?",
    confirm: "Bestätigt — genau so mache ich es.",
  },
  es: {
    debriefQuestions: [
      "¿Cuándo rechazarías la factura 4471 en lugar de contabilizarla?",
      "¿A quién preguntas cuando el importe supera los 10.000 $?",
      "¿Qué revisas antes de pulsar guardar?",
    ],
    teachBack:
      "Entonces el proceso es: abrir primero la factura más antigua, contabilizarla en el centro de costos que posee el contrato del proveedor, y parar para preguntar al gerente cuando el importe supere 10.000 $. ¿Lo entendí bien?",
    confirm: "Confirmado — exactamente así lo hago.",
  },
  fr: {
    debriefQuestions: [
      "Quand rejetteriez-vous la facture 4471 au lieu de la comptabiliser ?",
      "Qui consultez-vous quand le montant dépasse 10 000 $ ?",
      "Que vérifiez-vous avant d'appuyer sur enregistrer ?",
    ],
    teachBack:
      "Donc le processus est : ouvrir d'abord la facture la plus ancienne, la comptabiliser sur le centre de coûts qui détient le contrat du fournisseur, et s'arrêter pour demander au responsable dès que le montant dépasse 10 000 $. Ai-je bien compris ?",
    confirm: "Confirmé — c'est exactement comme ça que je procède.",
  },
  ja: {
    debriefQuestions: [
      "請求書4471を計上せず却下するのはどんな場合ですか？",
      "金額が$10,000を超える場合、誰に確認しますか？",
      "保存を押す前に何を確認しますか？",
    ],
    teachBack:
      "つまりプロセスは：最も古い請求書を最初に開き、ベンダーの契約を保有するコストセンターに計上し、金額が$10,000を超えたら必ずマネージャーに確認する。これで合っていますか？",
    confirm: "確認しました — まさにその通りです。",
  },
  pt: {
    debriefQuestions: [
      "Quando você rejeitaria a fatura 4471 em vez de lançá-la?",
      "Quem você consulta quando o valor passa de $10.000?",
      "O que você verifica antes de pressionar salvar?",
    ],
    teachBack:
      "Então o processo é: abrir primeiro a fatura mais antiga, lançá-la no centro de custos que detém o contrato do fornecedor, e parar para perguntar ao gerente sempre que o valor passar de $10.000. Entendi certo?",
    confirm: "Confirmado — é exatamente assim que eu faço.",
  },
  zh: {
    debriefQuestions: [
      "什么情况下你会拒绝发票 4471，而不是将其入账？",
      "金额超过 $10,000 时，你会请示谁？",
      "点击保存之前，你会检查什么？",
    ],
    teachBack:
      "流程是：先打开最早的发票，将其记入负责供应商合同的成本中心；金额超过 $10,000 时，暂停并请经理确认。我的理解正确吗？",
    confirm: "已确认，这正是我的处理方式。",
  },
};

const teach: Record<string, TeachCopy> = {
  en: {
    tutorialGreeting: "Let's start the tutorial on how to send an invoice.",
    coaching: [
      "Who are you sending the invoice to? Use the full name of the company or person.",
      "Before you save: which cost center owns this vendor's contract?",
      "Stop — the amount is {amount}. What did the expert say about the limit?",
    ],
    guardrailAlert:
      "Guardrail risk: {amount} is above $10,000. The expert always asks the manager first — replay their screen moment before you save.",
    masteryNote: "Guardrail awareness needs a second pass.",
  },
  de: {
    tutorialGreeting: "Beginnen wir mit dem Tutorial zum Senden einer Rechnung.",
    coaching: [
      "An wen geht diese Rechnung? Verwende den vollständigen Namen der Firma oder Person.",
      "Bevor du speicherst: welche Kostenstelle besitzt den Vertrag dieses Lieferanten?",
      "Stopp — der Betrag ist {amount}. Was hat der Experte über die Grenze gesagt?",
    ],
    guardrailAlert:
      "Guardrail-Risiko: {amount} liegt über 10.000 $. Der Experte fragt immer zuerst die Leitung — spiel den Bildschirmmoment ab, bevor du speicherst.",
    masteryNote: "Guardrail-Bewusstsein braucht einen zweiten Durchlauf.",
  },
  es: {
    tutorialGreeting: "Empecemos el tutorial sobre cómo enviar una factura.",
    coaching: [
      "¿A quién va dirigida la factura? Usa el nombre completo de la empresa o persona.",
      "Antes de guardar: ¿qué centro de costos posee el contrato de este proveedor?",
      "Alto — el importe es {amount}. ¿Qué dijo el experto sobre el límite?",
    ],
    guardrailAlert:
      "Riesgo de guardrail: {amount} supera los 10.000 $. El experto siempre pregunta primero al gerente — reproduce su momento de pantalla antes de guardar.",
    masteryNote: "La atención a los guardrails necesita una segunda pasada.",
  },
  fr: {
    tutorialGreeting: "Commençons le tutoriel sur l'envoi d'une facture.",
    coaching: [
      "À qui est destinée cette facture ? Utilise le nom complet de l'entreprise ou de la personne.",
      "Avant d'enregistrer : quel centre de coûts détient le contrat de ce fournisseur ?",
      "Stop — le montant est de {amount}. Qu'a dit l'expert à propos de la limite ?",
    ],
    guardrailAlert:
      "Risque de garde-fou : {amount} dépasse 10 000 $. L'expert demande toujours au responsable d'abord — rejouez son moment d'écran avant d'enregistrer.",
    masteryNote: "La vigilance aux garde-fous nécessite un second passage.",
  },
  ja: {
    tutorialGreeting: "請求書の送り方のチュートリアルを始めましょう。",
    coaching: [
      "この請求書はどなた宛てですか？会社または個人のフルネームを入力してください。",
      "保存する前に：このベンダーの契約を保有するコストセンターはどこですか？",
      "ストップ — 金額は{amount}です。上限についてエキスパートは何と言いましたか？",
    ],
    guardrailAlert:
      "ガードレールリスク：{amount}は$10,000を超えています。エキスパートは必ず先にマネージャーに確認します — 保存する前に画面モーメントを再生してください。",
    masteryNote: "ガードレールへの意識はもう一度練習が必要です。",
  },
  pt: {
    tutorialGreeting: "Vamos começar o tutorial de como enviar uma fatura.",
    coaching: [
      "Para quem é essa fatura? Use o nome completo da empresa ou da pessoa.",
      "Antes de salvar: qual centro de custos detém o contrato deste fornecedor?",
      "Pare — o valor é {amount}. O que o especialista disse sobre o limite?",
    ],
    guardrailAlert:
      "Risco de guardrail: {amount} está acima de $10.000. O especialista sempre pergunta ao gerente primeiro — reproduza o momento de tela dele antes de salvar.",
    masteryNote: "A atenção aos guardrails precisa de uma segunda passada.",
  },
  zh: {
    tutorialGreeting: "我们开始学习如何发送发票吧。",
    coaching: [
      "这张发票是开给谁的？请使用公司或个人的全名。",
      "保存前，请判断哪个成本中心负责这家供应商的合同。",
      "请暂停，金额是 {amount}。专家对限额是怎么说的？",
    ],
    guardrailAlert:
      "触发规则：{amount} 超过 $10,000。专家会先请经理确认，请在保存前回看对应的屏幕片段。",
    masteryNote: "还需要再练习一次限额规则。",
  },
};

export function getCaptureCopy(code: string): CaptureCopy {
  return capture[code] ?? capture["en"]!;
}
export function getMapCopy(code: string): MapCopy {
  return map[code] ?? map["en"]!;
}
export function getTeachCopy(code: string): TeachCopy {
  return teach[code] ?? teach["en"]!;
}

const USD_PREFIXED = new Set(["en", "ja", "pt", "zh"]);

/** Formats an amount in USD with the grouping style of the given language's copy. */
export function formatUsd(code: string, value: number): string {
  const rounded = Math.round(value * 100) / 100;
  const formatted = new Intl.NumberFormat(code, { maximumFractionDigits: 2 }).format(rounded);
  return USD_PREFIXED.has(code) ? `$${formatted}` : `${formatted} $`;
}
