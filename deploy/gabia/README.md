# NOVA 가비아 서버 배포

2026-11-23에 현재 로컬 소스를 Ubuntu 24.04 서버로 업로드하여 Linux 프로덕션 빌드를 설치했습니다. Git 원격에 push하지 않은 변경도 포함합니다. SSH 키와 로컬 환경변수 파일은 업로드하지 않았습니다.

## 서비스 구성

- 서버: `1.201.110.199`, 접속 계정 `ubuntu`
- NOVA 공개 주소: `http://1.201.110.199:8080` (가비아 인바운드 TCP 8080 허용 확인)
- 기존 Canvers: 기존 80/443 설정과 `sebit.service`, 3001 포트 유지
- NOVA 앱: `nova.service`, 전용 비로그인 계정 `nova`, `127.0.0.1:4000`
- Nginx: `/etc/nginx/sites-available/nova-8080`, `sites-enabled/nova-8080` 심볼릭 링크
- 최초 HTTP 호환 릴리스: `/srv/nova/releases/20261123-public-l4KcMc`
- 현재 배포 커밋: `/srv/nova/current/REVISION` 파일에서 확인
- 현재 버전 링크: `/srv/nova/current`
- 실행 환경: Node.js 24, `/etc/nova/nova.env` (root:nova, 0640)
- 실행 파일: `/srv/nova/current/apps/portal/.output/server/index.mjs`

NOVA와 Nginx는 부팅 후 자동 시작합니다. NOVA는 비정상 종료 시 5초 후 재시작합니다. 앱의 4000 포트를 외부에 열 필요는 없습니다. 현재 외부 Hub·Gateway·Nexus 설정은 없으며 소개·UX·Grid 데모를 제공합니다.

## 확인과 관리

서버 SSH 접속 후 실행합니다.

```bash
sudo systemctl status nova --no-pager
sudo journalctl -u nova -n 100 --no-pager
curl --fail http://127.0.0.1:4000/api/health
curl --fail http://127.0.0.1:8080/api/health
sudo systemctl restart nova
```

설정 파일의 저장소 원본은 `deploy/gabia/nova.service`, `deploy/gabia/nova-8080.conf`입니다. 서비스 설정 수정 시 `sudo systemctl daemon-reload`, Nginx 수정 시 `sudo nginx -t` 통과 후 `sudo systemctl reload nginx`를 실행합니다.

## 가비아 방화벽

서버 OS의 UFW는 비활성이고 nftables 규칙은 비어 있습니다. Nginx는 `0.0.0.0:8080`에서 정상 수신하며 서버 내부 health 응답은 정상입니다. 최초 외부 요청은 시간 초과였으며 사용자가 가비아 방화벽에 8080 허용 규칙을 추가한 뒤 외부 연결을 확인했습니다.

해당 서버에 연결된 방화벽에서 인바운드 TCP, 시작/끝 포트 8080, 소스 `0.0.0.0/0` 허용 규칙을 추가합니다. 기존 SSH·HTTP·HTTPS 규칙은 유지합니다. [가비아 방화벽 정책 안내](https://customer.gabia.com/manual/32/6751/13320)를 참고하세요.

## 검증

Linux 서버 빌드와 단위 테스트 42개, Nitro와 로컬 upstream 통합 테스트를 통과했습니다. SSH 터널로 실제 서버의 Grid를 Chromium에서 검증하여 정렬·검색·편집·검증·변경분·Excel 왕복·가상화·반응형을 확인했습니다. 기존 Canvers HTTPS도 200 응답을 유지합니다. 공개 HTTP 주소에서 메인·UX·Grid·health 모두 200 응답을 확인했고, Grid 브라우저 회귀 검사도 통과했습니다. HTTP 접속에서 지원되지 않는 randomUUID 대신 중복을 확인하는 임시 행 ID를 사용합니다.

## 다음 배포

환경변수·키·`.git`·`node_modules`·`.nuxt`·`.output`을 제외한 소스를 새 릴리스 디렉터리로 올리고 서버에서 `npm ci`, `npm run build`, `npm test`를 실행합니다. 기존 릴리스는 보관한 채 `/srv/nova/current` 링크를 새 릴리스로 전환하고 `nova.service`를 재시작한 뒤 health를 확인합니다. 문제가 있으면 직전 릴리스로 링크를 되돌리고 재시작합니다. 기존 Canvers 설정을 덮어쓰지 않습니다.

## 브랜치 기반 후속 작업

작업 브랜치(feature/* 또는 fix/*) → 커밋·push → dev PR 병합·검증 → prod 승격 → 가비아 새 릴리스 배포 순서로 진행합니다. 배포 릴리스에는 prod 커밋 SHA를 기록하고, 확인된 버전만 current 링크로 전환합니다. 소개·UX·Grid·서버 기반의 기준 작업 브랜치는 feature/nova-ux-grid-foundation입니다. 이후 배포는 prod에 병합된 정확한 SHA의 git archive만 사용합니다.

PR 병합·배포 요청을 받은 작업 세션에서 이 절차를 수행합니다. push를 자동 감지하는 GitHub Actions·웹훅은 구성하지 않았습니다. 상세 작업 규칙은 루트 AGENTS.md를 따릅니다.

배포 스크립트 deploy/gabia/deploy-release.sh는 전체 prod SHA와 git archive 경로를 인수로 받습니다. 새 릴리스에서 설치·테스트·타입 검사·빌드·통합 시험을 수행하고 임시 4002 포트에서 메인/UX/Grid/health를 확인한 뒤 current 링크를 전환합니다. 전환 후 health 실패 시 직전 버전으로 복구합니다. 실행 로그와 REVISION은 릴리스 디렉터리에 남깁니다.
