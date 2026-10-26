import LegalLayout, { LegalList, LegalSection } from "../LegalLayout";

export default function CookiesPage() {
  return <LegalLayout title="쿠키 및 저장 기술 안내" updated="2026년 10월 25일"><LegalSection title="1. 현재 사용하는 저장 기술"><p>현재 공개 데모는 로그인 계정 대신 브라우저 localStorage에 화면 설정, 대화 목록, 프로젝트 메타데이터를 저장할 수 있습니다. 이 데이터는 다른 브라우저나 기기와 자동으로 동기화되지 않습니다.</p></LegalSection><LegalSection title="2. 향후 사용할 수 있는 기술"><LegalList><li>필수 세션 쿠키: 로그인 상태와 보안을 유지하기 위한 쿠키</li><li>보안 저장소: CSRF 방지, 인증 만료와 기기 확인</li><li>선택적 분석 도구: 방문·성능 통계. 도입 시 별도 고지</li></LegalList></LegalSection><LegalSection title="3. 관리 방법"><p>브라우저 설정에서 저장 기술을 삭제하거나 차단할 수 있습니다. 다만 필수 세션 기능이 동작하지 않을 수 있습니다. 서비스 출시 후 실제 사용하는 쿠키의 이름, 목적, 보관기간, 제공업체를 표로 업데이트합니다.</p></LegalSection></LegalLayout>;
}
