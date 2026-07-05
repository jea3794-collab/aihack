# 담당: 최수인 — 데모용 기출문제 시드 데이터 (PRD 3.1 스코프: 물류관리론 + 물류관련법규 우선)
import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.models import Document, QuizQuestion

GLOSSARY_SOURCE = "물류관련 핵심용어해설집"
GLOSSARY_PATH = Path(__file__).parent / "data" / "logistics_glossary.json"

SAMPLE_QUESTIONS = [
    {
        "subject": "물류관리론",
        "question": "다음 중 JIT(Just In Time) 방식의 특징으로 가장 거리가 먼 것은?",
        "choices": [
            "필요한 양을 필요한 시점에 조달하여 재고를 최소화한다",
            "생산 리드타임 단축과 낭비 제거를 지향한다",
            "안전재고를 대폭 늘려 결품을 방지하는 것을 최우선 목표로 한다",
            "협력업체와의 정보 공유 및 신뢰가 중요하다",
            "소로트·다빈도 운송이 요구되는 경우가 많다",
        ],
        "answer_index": 2,
        "explanation": "JIT는 재고를 최소화하는 것이 핵심 목표이며, 안전재고를 늘리는 것은 JIT의 취지와 반대된다.",
    },
    {
        "subject": "물류관리론",
        "question": "물류의 7R 원칙에 해당하지 않는 것은?",
        "choices": [
            "Right Product",
            "Right Quantity",
            "Right Price",
            "Right Time",
            "Right Advertising",
        ],
        "answer_index": 4,
        "explanation": "7R 원칙은 Product, Quantity, Quality, Place, Time, Impression, Price로 구성되며 Advertising은 포함되지 않는다.",
    },
    {
        "subject": "물류관리론",
        "question": "공급사슬관리(SCM)에서 채찍효과(Bullwhip Effect)의 원인으로 보기 어려운 것은?",
        "choices": [
            "수요 예측의 왜곡",
            "일괄 주문(batch ordering)",
            "실시간 판매 정보(POS)의 전 구간 공유",
            "가격 변동에 따른 선구매",
            "공급 부족에 대한 과잉 주문(shortage gaming)",
        ],
        "answer_index": 2,
        "explanation": "POS 등 실시간 수요 정보를 전 구간이 공유하면 정보 왜곡이 줄어 채찍효과가 완화된다. 즉, 원인이 아니라 대응책에 해당한다.",
    },
    {
        "subject": "물류관리론",
        "question": "경제적 주문량(EOQ) 모형의 기본 가정으로 옳지 않은 것은?",
        "choices": [
            "수요는 일정하고 확실하게 알려져 있다",
            "주문비용과 재고유지비용은 알려져 있고 일정하다",
            "조달기간(lead time)은 일정하다",
            "수량할인이 존재하여 대량 주문 시 단가가 낮아진다",
            "재고 부족은 허용되지 않는다",
        ],
        "answer_index": 3,
        "explanation": "기본 EOQ 모형은 수량할인이 없다고 가정한다. 수량할인이 있는 경우는 별도의 확장 모형에서 다룬다.",
    },
    {
        "subject": "물류관리론",
        "question": "유통(물류)센터의 크로스도킹(Cross Docking)에 대한 설명으로 옳은 것은?",
        "choices": [
            "입고된 상품을 장기간 보관한 후 출고하는 방식이다",
            "입고 즉시 분류하여 보관 없이 바로 출고 차량으로 이동시키는 방식이다",
            "재고를 최대한 많이 쌓아두어 결품을 방지하는 방식이다",
            "보관 면적을 늘리기 위해 고안된 방식이다",
            "생산 공정 내에서만 사용되는 개념이다",
        ],
        "answer_index": 1,
        "explanation": "크로스도킹은 보관 과정을 최소화하여 입고 후 바로 출고 차량에 옮겨 싣는 물류 방식이다.",
    },
    {
        "subject": "물류관련법규",
        "question": "관세법상 '보세구역'에 대한 설명으로 옳은 것은?",
        "choices": [
            "관세 부과가 영구적으로 면제되는 구역이다",
            "외국물품을 관세 부과 없이 장치·보관·가공할 수 있도록 지정된 구역으로, 반출 시 통관 절차를 거쳐야 한다",
            "내국물품만 반입할 수 있는 구역이다",
            "자유무역지역과 완전히 동일한 법적 성격을 가진다",
            "수출입 신고 없이 물품을 자유롭게 국내로 반출할 수 있는 구역이다",
        ],
        "answer_index": 1,
        "explanation": "보세구역은 관세 부과를 유보(留保)한 상태로 외국물품을 장치·가공할 수 있는 구역이며, 국내로 반출하려면 통관(수입신고 및 관세 납부) 절차가 필요하다.",
    },
    {
        "subject": "물류관련법규",
        "question": "자유무역지역과 보세구역의 차이에 대한 설명으로 가장 적절한 것은?",
        "choices": [
            "자유무역지역은 관세법이 아닌 '자유무역지역의 지정 및 운영에 관한 법률' 등 별도 법령에 근거하여 지정되고, 보세구역보다 폭넓은 제조·물류·유통 활동이 허용된다",
            "자유무역지역은 보세구역의 하위 개념으로 완전히 포함된다",
            "두 제도는 법적 근거와 운영 목적이 동일하여 실무상 구분할 필요가 없다",
            "자유무역지역에서는 어떠한 경우에도 외국물품의 반입이 금지된다",
            "보세구역은 지방자치단체가, 자유무역지역은 관세청만이 단독으로 지정한다",
        ],
        "answer_index": 0,
        "explanation": "자유무역지역은 별도 법률에 근거해 지정되며 제조·물류·유통·전시 등 폭넓은 활동을 허용하는 반면, 보세구역은 관세법에 근거해 주로 장치·보관·가공 기능에 초점을 둔다.",
    },
    {
        "subject": "물류관련법규",
        "question": "화물자동차 운수사업법상 화물자동차 운송사업의 종류에 해당하지 않는 것은?",
        "choices": [
            "일반화물자동차 운송사업",
            "개인화물자동차 운송사업",
            "용달화물자동차 운송사업",
            "화물자동차 운송주선사업",
            "화물자동차 운송가맹사업",
        ],
        "answer_index": 2,
        "explanation": "화물자동차 운수사업법상 운송사업은 일반·개인 화물자동차 운송사업으로 구분되며, '용달'은 현행 법령상 별도 사업 종류로 존재하지 않는다.",
    },
    {
        "subject": "물류관련법규",
        "question": "물류정책기본법상 '물류시설'의 정의에 포함되지 않는 것은?",
        "choices": [
            "화물의 운송·보관·하역을 위한 시설",
            "화물의 운송·보관·하역과 관련된 가공·조립·분류·수리·포장 등을 위한 시설",
            "물류의 공동화·자동화를 위한 시설",
            "물류에 관한 정보 및 통신의 처리·수집·가공·저장을 위한 시설",
            "물류와 무관한 순수 주거 목적의 공동주택 시설",
        ],
        "answer_index": 4,
        "explanation": "물류정책기본법상 물류시설은 운송·보관·하역·가공·정보처리 등 물류 기능과 관련된 시설을 말하며, 주거 목적 공동주택은 해당하지 않는다.",
    },
    {
        "subject": "물류관련법규",
        "question": "수출입 통관 절차에서 '수입신고'에 대한 설명으로 옳은 것은?",
        "choices": [
            "수입신고는 물품이 국내에 반입되기 전에는 할 수 없다",
            "수입신고 수리 전에는 원칙적으로 물품을 국내에 반출할 수 없다",
            "수입신고는 관세 납부와 무관하게 이루어지는 단순 행정 절차이다",
            "보세구역에 반입된 물품은 수입신고 없이도 자유롭게 유통할 수 있다",
            "수입신고는 생략 가능한 임의 절차이다",
        ],
        "answer_index": 1,
        "explanation": "수입신고가 수리되기 전까지는 원칙적으로 물품을 보세구역 등에서 국내로 반출할 수 없다.",
    },
]


def seed_if_empty(db: Session) -> None:
    if db.query(QuizQuestion).count() > 0:
        return
    for item in SAMPLE_QUESTIONS:
        db.add(
            QuizQuestion(
                subject=item["subject"],
                question=item["question"],
                choices=json.dumps(item["choices"], ensure_ascii=False),
                answer_index=item["answer_index"],
                explanation=item.get("explanation"),
            )
        )
    db.commit()


def seed_glossary_if_empty(db: Session) -> None:
    """물류관련 핵심용어해설집(신지원에듀)을 문서 DB에 적재해 AI 자료 검색(RAG)의 근거로 활용한다."""
    if db.query(Document).filter(Document.source == GLOSSARY_SOURCE).count() > 0:
        return
    with open(GLOSSARY_PATH, encoding="utf-8") as f:
        entries = json.load(f)
    for item in entries:
        db.add(
            Document(
                subject=item["subject"],
                title=item["title"],
                content=item["content"],
                source=item["source"],
            )
        )
    db.commit()
