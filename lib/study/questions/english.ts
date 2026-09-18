import type { Question } from "../types";
import { build, type Draft } from "./helpers";

/** 모든 영어 지문은 유형 연습을 위해 새로 쓴 글이다(기출 원문 미사용). */

const P_PRACTICE = `Most people assume that skill comes mainly from talent. Yet researchers who followed expert musicians for years found something different. The best performers were not the ones who practiced the longest hours, but the ones who practiced with a clear goal and immediate feedback on each attempt. What separates them from the rest, then, is not the amount of practice but its ______.`;

const P_ROADS = `A city that adds more roads often finds traffic getting worse rather than better. Wider highways make driving feel faster and cheaper, so more people who used to take the bus decide to drive. Within a few years the new lanes are as crowded as the old ones ever were. The lesson planners keep relearning is that increasing supply can sometimes ______ the very demand it was built to relieve.`;

const P_FORGET = `Scientists once treated forgetting as a simple failure of memory, a leak in a bucket that should not leak. Recent work suggests almost the opposite. By discarding details that no longer apply, forgetting lets the brain keep the general patterns that still do. Someone who remembered every parking spot they had ever used would struggle to recall today's. Forgetting, in this view, is less a flaw than a form of ______.`;

const P_CHOICE = `Economists long assumed that offering people more options improves their decisions. Studies of workplace retirement plans complicate that view. When employees were offered dozens of funds, enrollment fell sharply compared with plans that offered only a handful. Faced with too many options, many workers postponed the decision indefinitely and ended up saving nothing. The finding suggests that expanding choice can ______.`;

const P_SLEEP = `Sleep is often treated as time taken away from useful work. The research points the other way. During deep sleep the brain clears waste products that accumulate while we are awake, and it strengthens the memories formed during the day. Cutting sleep to gain three working hours therefore trades a small gain in quantity of time for a much larger loss in the quality of that time.`;

const P_LIBRARY = `Public libraries were designed to lend books, but their role has quietly shifted. In many neighborhoods a library is now the only indoor space where a person can sit for hours without paying for anything. Librarians help people fill out job applications, escape dangerous heat, and find relief from loneliness. The building still holds books, but what it mainly offers now is access.`;

const P_WALRUS = `The Pacific walrus rests on floating sea ice between dives for clams. As summer ice retreats farther north each year, the animals must haul out on land instead, where thousands crowd onto narrow beaches. Stampedes triggered by a passing aircraft or a predator can crush young calves. Feeding trips from these beaches are also far longer, because the richest feeding grounds lie over the shallow shelf that the ice once covered.`;

const P_RUNWAY = `When the manager told the team the project still had "plenty of runway," everyone relaxed. Two weeks later the budget was frozen and half the team was reassigned. The phrase had never meant money in the bank. It had meant time before anyone senior would start asking hard questions — and that time had quietly run out while the team celebrated.`;

const drafts: Draft[] = [
  // ── 빈칸 추론 ───────────────────────────────────────────
  {
    id: "en-bl-b1", unit: "en-blank", topic: "en-blank-para", level: "basic",
    passage: P_PRACTICE,
    body: "빈칸에 들어갈 말로 가장 적절한 것은?",
    choices: ["length", "quality", "cost", "popularity"], answer: 1,
    key: "빈칸 앞의 'not A but B' 구조에서 B는 A의 반대 개념이다.",
    steps: [
      "빈칸 문장: not the amount of practice but its ______",
      "amount(양)의 반대 개념이 빈칸에 와야 한다.",
      "본문의 'clear goal', 'immediate feedback'은 연습의 질을 말한다. → quality",
    ],
    review: "빈칸 추론 — 'not A but B' 가 보이면 A의 반대말을 찾는다.",
  },
  {
    id: "en-bl-b2", unit: "en-blank", topic: "en-blank-logic", level: "basic",
    passage: P_ROADS,
    body: "빈칸에 들어갈 말로 가장 적절한 것은?",
    choices: ["reduce", "increase", "ignore", "replace"], answer: 1,
    key: "빈칸은 글 전체의 결론을 압축한 자리다.",
    steps: [
      "본문: 도로를 넓혔더니 운전자가 늘어 다시 막혔다.",
      "공급(도로)을 늘렸는데 수요(운전)가 늘어난 것이다.",
      "따라서 '공급 확대가 수요를 increase 할 수 있다'가 된다.",
    ],
    review: "빈칸이 마지막 문장에 있으면 앞 내용의 요약이다.",
  },
  {
    id: "en-bl-a1", unit: "en-blank", topic: "en-blank-para", level: "advanced",
    passage: P_FORGET,
    body: "빈칸에 들어갈 말로 가장 적절한 것은?",
    choices: ["decay", "editing", "repetition", "imitation"], answer: 1,
    key: "빈칸 앞의 'less a flaw than ~'은 긍정적 재해석을 요구한다.",
    steps: [
      "본문: 낡은 정보를 버려서 쓸모 있는 패턴만 남긴다.",
      "'버리고 남기는' 행위를 한 단어로 하면 editing(편집)이다.",
      "decay(부패)는 부정적이라 'less a flaw than'과 충돌한다.",
    ],
    review: "비유형 빈칸 — 본문의 행위를 한 단어로 압축하는 문제이다.",
  },
  {
    id: "en-bl-p1", unit: "en-blank", topic: "en-blank-logic", level: "applied",
    passage: P_CHOICE,
    body: "빈칸에 들어갈 말로 가장 적절한 것은?",
    choices: [
      "guarantee better outcomes",
      "reduce the likelihood of any choice at all",
      "lower the cost of each option",
      "make each option more valuable",
    ], answer: 1,
    key: "통념(long assumed) → 반박(complicate that view) 구조에서 빈칸은 반박 쪽이다.",
    steps: [
      "통념: 선택지가 많을수록 결정이 좋아진다.",
      "실제: 선택지가 많자 가입률이 떨어지고 결정을 미뤘다.",
      "빈칸은 통념의 반대 → '아예 선택하지 않게 만든다' → ②",
    ],
    review: "통념-반박 구조 — 빈칸은 거의 항상 반박 쪽 내용이다.",
  },

  // ── 주제 · 요지 · 제목 ───────────────────────────────────
  {
    id: "en-mn-b1", unit: "en-main", topic: "en-main-idea", level: "basic",
    passage: P_SLEEP,
    body: "윗글의 요지로 가장 적절한 것은?",
    choices: [
      "수면은 업무 시간을 빼앗는 낭비이다.",
      "잠을 줄여 얻는 시간보다 잃는 효율이 더 크다.",
      "깊은 잠은 낮에 만든 기억을 지운다.",
      "적정 수면 시간은 사람마다 크게 다르다.",
    ], answer: 1,
    key: "마지막 문장의 'trades A for B' 구조가 요지를 담고 있다.",
    steps: [
      "본문: 깊은 잠은 노폐물 제거와 기억 강화를 한다.",
      "마지막 문장: 시간의 양을 조금 얻고 질을 크게 잃는 거래이다.",
      "이를 우리말로 옮기면 ②이다.",
    ],
    review: "요지 문제 — 마지막 문장(therefore, thus 뒤)을 먼저 본다.",
  },
  {
    id: "en-mn-b2", unit: "en-main", topic: "en-main-title", level: "basic",
    passage: P_SLEEP,
    body: "윗글의 제목으로 가장 적절한 것은?",
    choices: [
      "Why Waste Builds Up in the Brain",
      "Sleep Is Not Lost Time",
      "How to Sleep Less and Work More",
      "A Short History of Sleep Research",
    ], answer: 1,
    key: "제목은 요지를 짧고 함축적으로 바꾼 것이다.",
    steps: [
      "요지: 잠은 시간 낭비가 아니다.",
      "①은 세부 내용일 뿐이고 ③은 본문과 반대이다.",
      "②가 요지를 그대로 압축한 제목이다.",
    ],
    review: "제목 = 요지의 압축. 세부 정보만 담은 선택지는 오답이다.",
  },
  {
    id: "en-mn-a1", unit: "en-main", topic: "en-main-idea", level: "advanced",
    passage: P_LIBRARY,
    body: "윗글의 요지로 가장 적절한 것은?",
    choices: [
      "도서관은 장서 수를 더 늘려야 한다.",
      "도서관은 책 대출을 넘어 누구에게나 열린 공간으로 기능한다.",
      "사서의 전문성이 점점 낮아지고 있다.",
      "도서관은 머지않아 사라질 것이다.",
    ], answer: 1,
    key: "'still ~, but mainly ~' 구조에서 but 뒤가 핵심이다.",
    steps: [
      "본문: 도서관은 여전히 책을 보유한다(still holds books).",
      "그러나 주로 제공하는 것은 'access'(접근·이용 기회)이다.",
      "구직 지원, 더위 피난처, 외로움 완화가 그 예시다. → ②",
    ],
    review: "역접 뒤가 주제 — still/but/however 다음 문장에 표시한다.",
  },
  {
    id: "en-mn-p1", unit: "en-main", topic: "en-main-title", level: "applied",
    passage: P_LIBRARY,
    body: "윗글의 제목으로 가장 적절한 것은?",
    choices: [
      "More Than a Place for Books",
      "How Libraries Choose Which Books to Buy",
      "The Steady Decline of Reading",
      "Training Better Librarians",
    ], answer: 0,
    key: "제목은 본문 전체를 포괄해야 하며, 일부만 다루면 오답이다.",
    steps: [
      "본문 핵심: 책 그 이상의 공간이 되었다.",
      "②④는 본문에 없는 내용, ③은 본문의 초점이 아니다.",
      "①이 '책을 넘어선 공간'이라는 주제를 포괄한다.",
    ],
    review: "제목 선택 — 지나치게 좁거나(세부) 넓은(무관) 선택지를 제거한다.",
  },

  // ── 순서 · 삽입 ─────────────────────────────────────────
  {
    id: "en-or-b1", unit: "en-order", topic: "en-order-seq", level: "basic",
    passage: `Glass looks solid, but the way it is made is strange.

(A) As the liquid cools, its molecules do not line up into a neat crystal the way water molecules do when they freeze.
(B) First, sand is heated to an extreme temperature until it melts into a thick, slow-moving liquid.
(C) Instead they freeze in place while still disordered, which is why glass shatters into sharp pieces rather than splitting along clean planes.`,
    body: "주어진 글 다음에 이어질 순서로 가장 적절한 것은?",
    choices: ["(A) - (B) - (C)", "(B) - (A) - (C)", "(B) - (C) - (A)", "(C) - (A) - (B)"], answer: 1,
    key: "First, As, Instead 같은 연결어가 순서의 결정적 단서이다.",
    steps: [
      "(B)의 'First'는 제조 과정의 시작이므로 맨 앞이다.",
      "(A)의 'As the liquid cools'는 (B)의 '액체'를 받는다.",
      "(C)의 'Instead they'는 (A)의 'do not line up'을 받는다.",
      "따라서 (B) - (A) - (C)",
    ],
    review: "순서 배열 — 지시어(they, this)와 연결어(First, Instead)를 먼저 표시한다.",
  },
  {
    id: "en-or-b2", unit: "en-order", topic: "en-order-insert", level: "basic",
    passage: `But the birds that arrive first do not always win.

① Many migratory birds race north as early as they can each spring. ② Arriving early means the best nesting sites and the first pick of mates. ③ A late frost can wipe out the insects the earliest arrivals depend on, leaving them with nests but no food. ④ Timing, then, is a gamble rather than a simple race.`,
    body: "주어진 문장이 들어가기에 가장 적절한 곳은?",
    choices: ["①", "②", "③", "④"], answer: 2,
    key: "역접(But) 문장은 '긍정적 서술'과 '반대 사례' 사이에 들어간다.",
    steps: [
      "①②는 일찍 도착하는 것의 장점을 말한다.",
      "③ 이후는 일찍 도착한 새가 굶는 단점을 말한다.",
      "흐름이 뒤집히는 지점인 ③ 자리에 But 문장이 들어간다.",
    ],
    review: "문장 삽입 — 주어진 문장의 연결어(But/However/Instead)가 자리를 알려 준다.",
  },
  {
    id: "en-or-a1", unit: "en-order", topic: "en-order-seq", level: "advanced",
    passage: `Historians once dated the birth of the first cities by the size of their ruins.

(A) Those administrative records, not the walls, are what separate a true city from a very large village.
(B) That measure turned out to be misleading, since several sprawling settlements had no central administration at all.
(C) Today researchers look instead for evidence of writing used to track grain, labor, and debt.`,
    body: "주어진 글 다음에 이어질 순서로 가장 적절한 것은?",
    choices: ["(A) - (C) - (B)", "(B) - (A) - (C)", "(B) - (C) - (A)", "(C) - (B) - (A)"], answer: 2,
    key: "'That measure'처럼 앞 문장을 가리키는 표현이 순서를 고정한다.",
    steps: [
      "(B)의 'That measure'는 주어진 글의 '유적 크기로 판단하던 방식'을 받는다.",
      "(C)의 'instead'는 (B)의 '그 방식이 잘못되었다'를 받아 대안을 제시한다.",
      "(A)의 'Those administrative records'는 (C)의 written records를 받는다.",
      "따라서 (B) - (C) - (A)",
    ],
    review: "지시형용사(That, Those) + 명사 → 바로 앞 단락에 그 명사가 있어야 한다.",
  },
  {
    id: "en-or-p1", unit: "en-order", topic: "en-order-insert", level: "applied",
    passage: `The difference lies in what happens after the failure.

① Two research teams can run the same experiment and get the same disappointing result. ② One team quietly files the result away and moves on to something more promising. ③ The other publishes it, and within a year three other labs avoid walking into the same dead end. ④ Both teams failed; only one of them made the failure useful.`,
    body: "주어진 문장이 들어가기에 가장 적절한 곳은?",
    choices: ["①", "②", "③", "④"], answer: 1,
    key: "'The difference'는 앞에 비교 대상이 이미 제시되어야 성립한다.",
    steps: [
      "①에서 두 팀이 '같은 결과'를 얻었다는 공통점이 제시된다.",
      "②③에서 두 팀의 행동이 갈라진다.",
      "따라서 '차이는 실패 이후에 있다'는 문장은 공통점 제시 직후인 ② 자리에 온다.",
    ],
    review: "삽입 문제 — 주어진 문장이 '앞에 무엇이 있어야 성립하는가'를 먼저 따진다.",
  },

  // ── 어법 · 어휘 ─────────────────────────────────────────
  {
    id: "en-gr-b1", unit: "en-grammar", topic: "en-grammar-form", level: "basic",
    body: "다음 빈칸에 들어갈 말로 어법상 옳은 것은?\n\nThe number of students in the program ______ increasing every year.",
    choices: ["are", "is", "were", "be"], answer: 1,
    key: "the number of + 복수명사 → 단수 취급 / a number of + 복수명사 → 복수 취급",
    steps: [
      "주어의 핵은 'The number'(그 수)이므로 단수다.",
      "'of students'는 수식어일 뿐 주어가 아니다.",
      "따라서 단수 동사 is 가 맞다.",
    ],
    review: "수일치 — 전치사구(of ~)를 지우고 진짜 주어를 찾는다.",
  },
  {
    id: "en-gr-b2", unit: "en-grammar", topic: "en-grammar-form", level: "basic",
    body: "다음 빈칸에 들어갈 말로 어법상 옳은 것은?\n\nThe committee suggested that he ______ the report by Friday.",
    choices: ["submits", "submit", "submitted", "submitting"], answer: 1,
    key: "제안·요구·주장 동사 뒤 that절은 (should) + 동사원형",
    steps: [
      "suggest, demand, insist, request 뒤의 that절은 당위를 나타낸다.",
      "이때 should가 생략되어 동사원형만 남는다.",
      "주어가 he여도 -s를 붙이지 않는다. → submit",
    ],
    review: "당위의 that절 — 시제·인칭과 무관하게 동사원형",
  },
  {
    id: "en-gr-a1", unit: "en-grammar", topic: "en-grammar-form", level: "advanced",
    body: "다음 문장의 어법상 문제점으로 가장 적절한 것은?\n\nHaving finished the work, the report was submitted by Mina.",
    choices: [
      "주절과 분사구문의 시제가 일치하지 않는다.",
      "분사구문의 의미상 주어가 주절의 주어와 다르다.",
      "이 문장에서는 수동태를 쓸 수 없다.",
      "관계대명사가 빠져 있다.",
    ], answer: 1,
    key: "분사구문의 의미상 주어는 주절의 주어와 같아야 한다.",
    steps: [
      "일을 끝낸 주체(Having finished)는 Mina이다.",
      "그런데 주절의 주어는 the report(보고서)다.",
      "보고서가 일을 끝낼 수는 없으므로 주어 불일치이다.",
      "→ Having finished the work, Mina submitted the report.",
    ],
    review: "분사구문 — 주절의 주어를 먼저 확인하고 분사의 주체와 맞춰 본다.",
  },
  {
    id: "en-gr-p1", unit: "en-grammar", topic: "en-grammar-word", level: "applied",
    body: "문맥상 빈칸에 들어갈 말로 가장 적절한 것은?\n\nThe new policy was intended to ______ the income gap, but a review five years later found the gap had widened instead.",
    choices: ["narrow", "deepen", "ignore", "measure"], answer: 0,
    key: "but 앞뒤는 반대 방향이다. 뒤가 'widened'이므로 앞은 '좁히다'여야 한다.",
    steps: [
      "but 뒤: the gap had widened (격차가 벌어졌다)",
      "'intended to ~ but 실제로는 반대'라는 구조이다.",
      "따라서 의도는 격차를 좁히는 것 → narrow",
    ],
    review: "문맥 어휘 — 역접 연결어를 기준으로 방향(+/−)을 표시한 뒤 고른다.",
  },

  // ── 함축 의미 · 심경 ────────────────────────────────────
  {
    id: "en-im-b1", unit: "en-imply", topic: "en-imply-meaning", level: "basic",
    passage: P_RUNWAY,
    body: "밑줄 친 plenty of runway 가 의미하는 바로 가장 적절한 것은?",
    choices: [
      "a large amount of money in the budget",
      "time remaining before serious scrutiny begins",
      "a long strip of land at an airport",
      "unusually strong morale within the team",
    ], answer: 1,
    key: "함축 의미는 본문이 직접 풀어 준 문장에서 확인한다.",
    steps: [
      "본문: 'It had never meant money in the bank.' → ① 탈락",
      "이어서 'It had meant time before anyone senior would start asking hard questions.'",
      "이를 영어로 바꾼 것이 ②이다.",
    ],
    review: "함축 의미 — 비유 표현 뒤에 풀이 문장이 따라오는 경우가 많다.",
  },
  {
    id: "en-im-b2", unit: "en-imply", topic: "en-imply-meaning", level: "basic",
    passage: P_RUNWAY,
    body: "팀의 심경 변화로 가장 적절한 것은?",
    choices: [
      "excited → proud",
      "relieved → uneasy",
      "angry → calm",
      "bored → amused",
    ], answer: 1,
    key: "심경 변화는 사건 전후의 행동 묘사에서 읽는다.",
    steps: [
      "처음: 'everyone relaxed' → 안도(relieved)",
      "이후: 예산 동결, 인원 재배치 → 불안(uneasy)",
      "따라서 relieved → uneasy",
    ],
    review: "심경 문제 — 감정 형용사가 없으면 인물의 행동으로 판단한다.",
  },
  {
    id: "en-im-a1", unit: "en-imply", topic: "en-imply-meaning", level: "advanced",
    passage: P_RUNWAY,
    body: "글쓴이의 태도로 가장 적절한 것은?",
    choices: [
      "경영진의 신속한 결정을 칭찬한다.",
      "모호한 표현이 심각한 오해를 낳을 수 있음을 지적한다.",
      "예산 동결이라는 결과를 환영한다.",
      "팀원들의 게으름을 비판한다.",
    ], answer: 1,
    key: "글쓴이의 태도는 사건을 서술하는 말투(quietly, had never meant)에서 드러난다.",
    steps: [
      "'The phrase had never meant money' → 표현과 실제의 괴리를 지적",
      "'that time had quietly run out while the team celebrated' → 오해의 대가를 강조",
      "따라서 모호한 표현의 위험을 지적하는 태도이다.",
    ],
    review: "필자의 태도 — 사실 나열 속의 평가어(quietly, never)를 찾는다.",
  },
  {
    id: "en-im-p1", unit: "en-imply", topic: "en-imply-meaning", level: "applied",
    passage: P_RUNWAY,
    body: "윗글이 경고하는 상황과 가장 유사한 것은?",
    choices: [
      "계약서에 지급 금액과 기한을 정확히 명시했다.",
      "'곧 검토해 보겠다'는 답변을 사실상의 승인으로 받아들였다.",
      "회의 시간을 한 시간에서 30분으로 줄였다.",
      "예산안 전문을 사내에 공개했다.",
    ], answer: 1,
    key: "유추 문제는 본문의 '구조'(모호한 말 → 낙관적 해석 → 뒤늦은 대가)를 옮긴다.",
    steps: [
      "본문 구조: 모호한 표현을 유리하게 해석 → 나중에 손해",
      "①④는 오히려 모호함을 없애는 사례다.",
      "②가 모호한 답변을 승인으로 오해한 같은 구조이다.",
    ],
    review: "유추·적용 — 소재가 아니라 구조가 같은 것을 고른다.",
  },

  // ── 세부 내용 · 도표 ────────────────────────────────────
  {
    id: "en-dt-b1", unit: "en-detail", topic: "en-detail-match", level: "basic",
    passage: P_WALRUS,
    body: "윗글의 내용과 일치하는 것은?",
    choices: [
      "태평양 바다코끼리는 잠수 사이에 떠 있는 해빙 위에서 쉰다.",
      "여름 해빙은 해마다 남쪽으로 확장되고 있다.",
      "육지에 오르면 먹이터까지의 거리가 더 가까워진다.",
      "스탬피드는 다 자란 개체에게만 위험하다.",
    ], answer: 0,
    key: "일치 문제는 선택지 순서대로 지문에서 근거를 찾는다.",
    steps: [
      "①: 'rests on floating sea ice between dives'와 일치",
      "②: 'retreats farther north'(북쪽으로 물러남)와 반대",
      "③: 'feeding trips ... are also far longer'와 반대",
      "④: 'can crush young calves'(새끼)와 반대",
    ],
    review: "일치 문제 — 방향(north/south), 증감(longer/shorter)이 자주 뒤바뀐다.",
  },
  {
    id: "en-dt-b2", unit: "en-detail", topic: "en-detail-match", level: "basic",
    passage: P_WALRUS,
    body: "윗글의 내용과 일치하지 않는 것은?",
    choices: [
      "여름 해빙이 점점 북쪽으로 물러나고 있다.",
      "수천 마리가 좁은 해변에 모여든다.",
      "지나가는 항공기가 스탬피드를 유발할 수 있다.",
      "육지에서 출발하는 먹이 활동의 거리가 더 짧아진다.",
    ], answer: 3,
    key: "부정형 발문이므로 '지문과 어긋나는 것' 하나를 찾는다.",
    steps: [
      "①②③은 지문에 그대로 나온다.",
      "지문은 'feeding trips ... are also far longer'라고 했다.",
      "④는 short(짧아진다)로 뒤집었으므로 불일치이다.",
    ],
    review: "불일치 문제 — 나머지 3개가 맞는지 확인해 교차 검증한다.",
  },
  {
    id: "en-dt-a1", unit: "en-detail", topic: "en-detail-match", level: "advanced",
    passage: P_WALRUS,
    body: "해빙 감소가 새끼 바다코끼리에게 위험한 이유로 가장 적절한 것은?",
    choices: [
      "바닷물의 온도가 급격히 낮아지기 때문에",
      "좁은 해변에 밀집해 압사 위험이 커지기 때문에",
      "먹이가 되는 조개가 육지로 이동하기 때문에",
      "천적이 모두 사라져 개체 수가 폭증하기 때문에",
    ], answer: 1,
    key: "인과를 묻는 문제는 결과(위험)로부터 원인 문장을 역추적한다.",
    steps: [
      "해빙 감소 → 육지 상륙 → 좁은 해변에 수천 마리 밀집",
      "'Stampedes ... can crush young calves'",
      "따라서 밀집으로 인한 압사가 직접적 이유다.",
    ],
    review: "인과 관계 — 지문의 연쇄(A → B → C)를 화살표로 정리한다.",
  },
  {
    id: "en-dt-p1", unit: "en-detail", topic: "en-detail-match", level: "applied",
    passage: P_WALRUS,
    body: "윗글을 근거로 할 때, 여름 해빙이 계속 감소한다면 가장 일어나기 쉬운 변화는?",
    choices: [
      "먹이 활동 거리가 짧아진다.",
      "육지로 올라오는 무리가 더 많아진다.",
      "해변에 모이는 바다코끼리 수가 줄어든다.",
      "대륙붕 위의 얼음이 다시 늘어난다.",
    ], answer: 1,
    key: "예측 문제는 지문에 나온 인과 사슬을 한 칸 더 밀어 본다.",
    steps: [
      "지문: 해빙이 줄어들수록 육지로 haul out 해야 한다.",
      "이 경향이 계속되면 육지 상륙이 더 늘어난다. → ②",
      "①③④는 모두 지문의 인과와 반대 방향이다.",
    ],
    review: "예측 문제 — 지문의 추세를 뒤집는 선택지는 전부 오답이다.",
  },
];

export const ENGLISH_QUESTIONS: Question[] = build("english", drafts);
