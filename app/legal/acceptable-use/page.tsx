import LegalLayout, { LegalList, LegalSection } from "../LegalLayout";

export default function AcceptableUsePage() {
  return <LegalLayout title="이용 제한 및 AI 안전 안내" updated="2026년 10월 25일"><LegalSection title="허용되는 사용"><p>GOYU AI는 학습, 아이디어 정리, 문서 초안, 코드 보조, 업무 계획처럼 이용자에게 유익한 작업을 돕기 위한 서비스입니다.</p></LegalSection><LegalSection title="금지되는 사용"><LegalList><li>불법 침입, 계정 탈취, 악성코드 제작·배포</li><li>사기, 피싱, 개인정보 침해, 저작권·상표권 침해</li><li>폭력·자해·위험 행위를 실행하도록 돕는 요청</li><li>사람을 차별하거나 고위험 결정을 자동화하는 용도</li><li>서비스를 과부하시키거나 보호장치를 우회하는 행위</li></LegalList></LegalSection><LegalSection title="검토와 제한"><p>운영자는 보안과 법령 준수를 위해 요청·사용량·오류를 검토하고, 필요한 경우 기능 제한이나 계정 보호 조치를 할 수 있습니다. 실제 운영 전에는 신고·이의제기·계정 복구 절차를 마련해 공개해야 합니다.</p></LegalSection></LegalLayout>;
}
