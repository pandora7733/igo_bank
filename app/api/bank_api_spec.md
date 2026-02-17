# 은행 시스템 필수 API 명세

AI CFO 시스템과 연동하기 위해 은행 서버에서 제공해야 하는 API 목록입니다.

---

## 요약

| # | Method | Endpoint | 호출 주체 | 목적 |
|---|--------|----------|-----------|------|
| 1 | `GET` | `/api/account/{account_number}` | 프론트엔드 | 계좌 잔액 조회 |
| 2 | `POST` | `/api/transfer_internal` | 프론트엔드 | 계좌 간 이체 |
| 3 | `POST` | `/api/transfer` | 프론트엔드 | 입출금 |
| 4 | `GET` | `/api/transactions/{account_number}` | 프론트엔드 | 거래 내역 조회 |

---

## 1. 계좌 조회

```
GET /api/account/{account_number}
```

**응답** `200`
```json
{
  "account": {
    "id": "1",
    "username": "user1",
    "account_number": "110-3456-7890",
    "balance": 2800000,
    "created_at": "2026-02-16 23:30"
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `account_number` | `string` | 계좌번호 |
| `username` | `string` | 예금주 |
| `balance` | `integer` | 잔액 (원) |

---

## 2. 계좌 개설

```
POST /api/account
```

**요청**
```json
{
  "owner_name": "테스터",
  "account_type": "SAVINGS",
  "name": "여행 적금",
  "initial_balance": 0
}
```

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `owner_name` | `string` | X | `"테스트 유저"` | 예금주 |
| `account_type` | `string` | X | `"MAIN"` | `MAIN` 또는 `SAVINGS` |
| `name` | `string` | X | 타입별 자동 | 계좌 별칭 |
| `initial_balance` | `integer` | X | `0` | 초기 잔액 |

**응답** `201`
```json
{
  "account": {
    "account_number": "393-3885-9033",
    "owner_name": "테스터",
    "account_type": "SAVINGS",
    "name": "여행 적금",
    "balance": 0
  },
  "message": "계좌 개설 완료: 393-3885-9033 (여행 적금)"
}
```

> [!NOTE]
> `account_number`는 서버에서 자동 생성합니다. 응답에 포함된 값을 Goal의 `linked_account`에 저장합니다.

---

## 3. 내부 이체

```
POST /api/transfer_internal
```

**요청**
```json
{
  "from_account": "110-3456-7890",
  "to_account": "393-3885-9033",
  "amount": 500000
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `from_account` | `string` | O | 출금 계좌번호 |
| `to_account` | `string` | O | 입금 계좌번호 |
| `amount` | `integer` | O | 이체 금액 (> 0) |

**응답** `200`
```json
{
  "message": "메인 통장 → 여행 적금 500,000원 이체 완료",
  "from_balance": 2300000,
  "to_balance": 500000
}
```

**에러**
- `400` — 금액이 0 이하
- `404` — 계좌 없음
- `400` — 잔액 부족

---

## 4. 카드 결제

```
POST /api/payment
```

**요청**
```json
{
  "account_number": "110-3456-7890",
  "amount": 15000,
  "merchant": "스타벅스 강남점"
}
```

**응답** `200`
```json
{
  "message": "결제 완료: 스타벅스 강남점 15,000원",
  "balance": 2785000,
  "transaction": { "..." }
}
```

---

## 5. 입출금

```
POST /api/transfer
```

**요청**
```json
{
  "account_number": "110-3456-7890",
  "type": "DEPOSIT",
  "amount": 3500000,
  "merchant": "급여 입금"
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `type` | `string` | `DEPOSIT` (입금) 또는 `WITHDRAW` (출금) |
| `amount` | `integer` | 금액 |
| `merchant` | `string` | 거래 설명 |

**응답** `200`
```json
{
  "message": "입금 완료: 3,500,000원",
  "balance": 6285000
}
```

---

## 6. 거래 내역 조회

```
GET /api/transactions/{account_number}
```

**응답** `200`
```json
{
  "transactions": [
    {
      "id": 1,
      "account_number": "110-3456-7890",
      "tx_type": "PAYMENT",
      "amount": 15000,
      "merchant": "스타벅스 강남점",
      "timestamp": "2026-02-16 23:35"
    }
  ]
}
```

| `tx_type` 값 | 설명 |
|--------------|------|
| `DEPOSIT` | 입금 |
| `WITHDRAW` | 출금 |
| `PAYMENT` | 카드 결제 |
| `TRANSFER` | 내부 이체 |
