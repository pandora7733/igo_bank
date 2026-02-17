# API 요청 가이드

<b>계좌조회</b>
<code>GET api/account/[계좌번호]</code>
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
<br>
<b>계좌거래내역 조회</b>
<br>
<code>GET /api/account/transaction/[계좌번호]</code>

```json
{
  "success": true,
  "account_number": "110-3456-7890",
  "total_count": 2,
  "transactions": [
    {
      "id": 5,
      "type": "TRANSFER",
      "amount": 50000,
      "sender_id": 1,
      "receiver_id": 2,
      "timestamp": "2026-02-17 14:20:00"
    },
    {
      "id": 1,
      "type": "DEPOSIT",
      "amount": 100000,
      "sender_id": null,
      "receiver_id": 1,
      "timestamp": "2026-02-16 09:00:00"
    }
  ]
}
```
<br>
<b>사용자 조회</b>
<br>

<code>GET /api/user/[전화번호]</code>
```json
{
  "success": true,
  "user": {
    "id": "5",
    "username": "김철수"
  }
}
```
<br>