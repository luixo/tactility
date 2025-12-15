Schema:

- games
  - id
  - admin id
  - player id list (may or may not include admin id)
  - playerIndex
  - cardsIdsList (by player id list - 3 cards each + the rest is deck)
  - dicardedCardsAmount (to know when to shuffle)
- users
  - id
- cards
  - id
  - text
  - type 'regular' | 'threesome' | 'round'
