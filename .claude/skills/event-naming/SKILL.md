---
name: event-naming
description: GA4 이벤트 이름을 짓거나 검토할 때 사용. 사용자가 설명한 행동에서 동사를 찾아 GA4 네이밍 규칙(소문자 시작, 영문 소문자/숫자/밑줄만, 40자 이내, ga_/google_/firebase_ 접두어 금지, 구글 기본 제공 이벤트명 우선)에 맞는 이름을 제안하고 이유를 함께 설명한다.
---

# GA4 이벤트 이름짓기

사용자가 설명한 행동(예: "장바구니에 상품을 담았을 때", "회원가입 버튼을 눌렀을 때")을 보고 GA4 이벤트 이름을 짓거나 검토한다.

## 절차

1. 사용자가 설명한 행동에서 핵심 동사(행동)를 찾는다.
2. 해당 행동이 구글이 이미 제공하는 GA4 자동 수집 이벤트 또는 권장 이벤트(예: `page_view`, `session_start`, `first_visit`, `purchase`, `add_to_cart`, `remove_from_cart`, `view_item`, `view_item_list`, `select_item`, `view_cart`, `begin_checkout`, `add_payment_info`, `add_shipping_info`, `login`, `sign_up`, `search`, `share`, `view_search_results`, `select_promotion`, `view_promotion`, `add_to_wishlist`, `generate_lead`, `refund` 등)와 일치하거나 매우 유사하면, 새 이름을 만들지 않고 그 기존 이벤트 이름을 우선 사용한다.
3. 일치하는 기존 이벤트가 없으면 새 이름을 짓는다. 이때 다음 규칙을 반드시 지킨다.
   - 동사를 찾아 영어 소문자로 시작한다.
   - 영문 소문자, 숫자, 밑줄(`_`)만 사용한다.
   - 낱말과 낱말은 밑줄로 이어준다 (snake_case).
   - 전체 길이는 40자를 넘기지 않는다.
   - `ga_`, `google_`, `firebase_`로 시작하지 않는다.

## 출력 형식

다음 두 줄만 출력한다.

- 이벤트 이름: `event_name_here`
- 이유: (기존 이벤트를 썼다면 "구글 기본 제공 이벤트 `xxx`와 일치하여 그대로 사용" 등으로, 새로 지었다면 어떤 동사와 규칙을 근거로 지었는지 한 줄로 설명)

추가 설명이나 대안 목록은 덧붙이지 않는다.
