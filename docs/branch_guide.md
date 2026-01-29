## Branch Guide

### 깃 브랜치 생성해 기능 추가
- 깃 브랜치 생성 : git checkout -b [branch_name]
- 깃 추가 : git add .
- 깃 커밋 : git commit -m "커밋 메세지"
- 깃 푸시 : git push -u origin [branch_name]
- 깃 PR 생성 : 주요 구현 내용 / 추가 설명 등 작성

### 깃허브에서 main 머지 후
- 깃허브 브랜치 동기화 : git fetch -p
- 깃허브 브랜치 조회 : git branch -r
- main으로 이동 : git checkout main
- main 동기화 : git pull origin main
- **(브랜치 생성 당사자)** 기능 branch 삭제 : git branch -d [branch_name]

### 기타
- 깃허브 브랜치를 로컬에 연결 : git checkout -t origin/[branch_name]


### PR 넘버를 통해 fetch
- git fetch origin pull/[PR_number]/head:[branch_name]
- git checkout [branch_name]

- 예시
- git fetch origin pull/10/head:pr-10
- git checkout pr-10