# 不要ブランチ整理ログ（2026-05-14）

## Summary

PR #98 のマージ後、次タスクへ進む前にRepository上の残存ブランチを確認した。

本ログは、不要ブランチ整理の判断履歴、削除候補、削除できなかった理由、次アクションをRepositoryへ永続化するための記録である。

## Background

`docs/ai-protocol/PROMPT.txt` では、merge後のbranch lifecycle確認、作業ログ保存、handoff情報の保存が必須とされている。

PR #98 はマージ済みであり、Issue #97 も完了済みである。次Issue #99 へ進む前に、過去PR由来の不要branchが残っていないかを確認した。

## Objectives

- main以外の残存branchを確認する
- merge済みPR由来の削除候補branchを整理する
- close済み未mergeの重複・置換PR由来branchを整理する
- 削除できない場合は理由と手順を記録する
- 次担当者が安全にbranch cleanupを継続できる状態にする

## Scope

対象Repository:

- `mizzz-dev/NTE-Build-Score-Calculator`

対象:

- GitHub上のremote branch
- close済みPRのhead branch
- merge済みPRのhead branch
- 重複・置換によりclosedとなった未merge PRのhead branch

対象外:

- `main`
- 新規実装
- docs以外のコード変更
- CI/CD設定変更
- GitHub Actions再実行
- DB/auth/infra/deployment変更

## Current Branch Snapshot

2026-05-14確認時点でGitHub上に残っていたbranch:

```txt
main
add-master-management-for-characters,-roles,-statuses
add-ocr-input-assistance-ui-to-/score
add-requirements-document-for-nte-build-score-calculator
connect-scoreconfig-to-/card-and-/compare
create-documentation-for-repository-memory
create-initial-master-data-operations-documentation
create-logs-for-ocr-quality-evaluation-cycle-3
define-ocr-quality-evaluation-process
define-requirements-for-ocr-functionality
implement-admin-dashboard-with-read-only-access
implement-compatibility-tests-for-scoreconfig
implement-content-management-in-admin
implement-db-structure-for-admin-management
implement-level-3-ai-protocol
implement-level-3-ai-protocol-nn8zus
implement-level-3-ai-protocol-s8mzbu
implement-ocr-quality-evaluation-cycle-2
improve-ocr-failure-user-experience
improve-ocr-failure-user-experience-hf8zsm
improve-ocr-input-assistance-ui
improve-ocr-processing-time-for-low-spec-devices
practions
```

## Deletion Candidates

### Safe deletion candidates: merged PR head branches

以下は対応PRがmerge済みで、原則としてremote branch削除対象である。

```txt
add-master-management-for-characters,-roles,-statuses                  # PR #46 merged
add-ocr-input-assistance-ui-to-/score                                  # PR #70 merged
add-requirements-document-for-nte-build-score-calculator               # PR #1 merged
connect-scoreconfig-to-/card-and-/compare                              # PR #60 merged
create-documentation-for-repository-memory                             # PR #80 merged
create-initial-master-data-operations-documentation                     # PR #64 merged
create-logs-for-ocr-quality-evaluation-cycle-3                         # PR #100 merged

define-ocr-quality-evaluation-process                                  # PR #82 merged
define-requirements-for-ocr-functionality                              # PR #66 merged
implement-admin-dashboard-with-read-only-access                        # PR #42 merged
implement-compatibility-tests-for-scoreconfig                          # PR #62 merged
implement-content-management-in-admin                                  # PR #44 merged
implement-db-structure-for-admin-management                            # PR #40 merged
implement-ocr-quality-evaluation-cycle-2                               # PR #96 merged
improve-ocr-failure-user-experience                                    # PR #84 merged
improve-ocr-failure-user-experience-hf8zsm                              # PR #88 merged
improve-ocr-input-assistance-ui                                        # PR #72 merged
improve-ocr-processing-time-for-low-spec-devices                       # PR #98 merged
```

### Deletion candidates: closed unmerged duplicate/replaced branches

以下はPRがclosedかつ未mergeであるが、後続PRで内容が集約・置換された履歴があるため、復旧予定がなければ削除候補である。

```txt
implement-level-3-ai-protocol          # PR #89 closed unmerged。PR #92で集約済み
implement-level-3-ai-protocol-nn8zus    # PR #91 closed unmerged。PR #92で集約済み
implement-level-3-ai-protocol-s8mzbu    # PR #90 closed unmerged。PR #92で集約済み
practions                               # PR #93 closed unmerged。PR #94でテスト/CI対応が集約済み
```

## Technical Decisions

### 採用方針

- `main` は保持する。
- merge済みPR由来のhead branchは、rollbackが必要な場合でもPR revertで対応できるため削除候補とする。
- closed unmergedの重複・置換branchは、対応内容が後続PRに集約されている場合のみ削除候補とする。
- 削除操作を実施できない場合も、削除候補と判断理由をRepositoryへ記録する。

### 却下した方針

- 未確認のbranchを一括削除する。
  - 理由: closed unmerged branchには未反映作業が残る可能性があるため、PR履歴と照合が必要。
- `main` 以外を無条件削除する。
  - 理由: 復旧・調査用branchが残っている可能性を考慮する必要がある。
- branchをmainへforce updateして疑似的に無効化する。
  - 理由: 削除ではなく履歴を壊す可能性があり、安全なcleanupではない。

## Execution Result

実施済み:

- branch一覧確認
- closed/merged PRとの照合
- safe deletion candidates整理
- closed unmerged duplicate candidates整理
- 本ログ作成

未実施:

- remote branch削除

未実施理由:

- 現在利用可能なGitHub連携ツールに、remote branch refを削除する操作が提供されていないため。
- `update_ref` は存在するが、branch削除ではなくref移動であり、安全なcleanup手段ではないため使用しない。

## Manual Cleanup Commands

権限のあるローカル環境またはGitHub UIで削除する場合は、以下を実行する。

```bash
git fetch --prune

git push origin --delete \
  add-master-management-for-characters,-roles,-statuses \
  add-ocr-input-assistance-ui-to-/score \
  add-requirements-document-for-nte-build-score-calculator \
  connect-scoreconfig-to-/card-and-/compare \
  create-documentation-for-repository-memory \
  create-initial-master-data-operations-documentation \
  create-logs-for-ocr-quality-evaluation-cycle-3 \
  define-ocr-quality-evaluation-process \
  define-requirements-for-ocr-functionality \
  implement-admin-dashboard-with-read-only-access \
  implement-compatibility-tests-for-scoreconfig \
  implement-content-management-in-admin \
  implement-db-structure-for-admin-management \
  implement-ocr-quality-evaluation-cycle-2 \
  improve-ocr-failure-user-experience \
  improve-ocr-failure-user-experience-hf8zsm \
  improve-ocr-input-assistance-ui \
  improve-ocr-processing-time-for-low-spec-devices
```

closed unmerged重複branchも削除する場合:

```bash
git push origin --delete \
  implement-level-3-ai-protocol \
  implement-level-3-ai-protocol-nn8zus \
  implement-level-3-ai-protocol-s8mzbu \
  practions
```

GitHub UIで削除する場合:

1. Repositoryの `Branches` を開く
2. 上記branchが `merged` またはclosed PR由来であることを確認する
3. `main` は削除しない
4. 該当branchの削除ボタンで削除する
5. 削除後、`git fetch --prune` を実行してローカル参照を整理する

## Test Results

コード変更は行っていない。

実施した確認:

- GitHub branch一覧確認
- closed PR一覧確認
- open PRが存在しないことの確認

未実行:

- `pnpm lint`
- `pnpm test`
- `pnpm build`

未実行理由:

- 本作業はbranch棚卸しとログ追加のみであり、アプリケーションコードに変更を加えていないため。

## Risks

- 削除操作が未実施のため、不要branchは現時点ではremoteに残っている。
- closed unmerged branchには、後続PRへ完全に集約済みか最終確認が必要なものがある。
- GitHub UI/CLIで手動削除する際に、`main` や新規作業branchを誤って削除しないよう注意が必要。

## Known Issues

- 現在利用可能なGitHub連携ツールでは、remote branch削除操作ができない。
- branch削除後の確認は、`search_branches` またはGitHub UIのBranches画面で再確認する必要がある。

## Remaining Tasks

P0:

- 権限のある環境で上記candidate branchを削除する
- 削除後にbranch一覧を再確認する

P1:

- `docs/active-issues.md` にbranch cleanup完了状態を反映するか判断する
- 次Issue #99へ進む前にopen PR / open branchの有無を再確認する

## Next Actions

1. GitHub UIまたはローカルCLIでcandidate branchを削除する。
2. 削除後に `git fetch --prune` を実行する。
3. branch一覧に `main` と必要な作業branchのみ残っていることを確認する。
4. Issue #99（OCR品質評価 第3サイクル実測）へ進む。

## AI Prompts Used

### ChatGPT向け作業プロンプト

目的: 次Issueへ進む前に不要branchを整理し、作業履歴・ログをRepositoryへ保存するため。

```txt
次に進める前に、不要なブランチの整理をしておきたい。
これまでと同様にレポジトリに作業履歴、ログは残して。
```

## References

- PR #98: `/score OCR待機UXとfallback判断を改善`
- PR #100: `/score OCR品質評価 第3サイクル実測ログを追加`
- Issue #99: `/score OCR品質評価の第3サイクル実測を実施する`
- `docs/ai-protocol/PROMPT.txt`
- `docs/current-status.md`
- `docs/active-issues.md`
