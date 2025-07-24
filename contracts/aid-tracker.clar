(define-map commitments (tuple (id uint)) (tuple (from principal) (to principal) (amount uint) (confirmed bool)))

(define-public (add-commitment (id uint) (to principal) (amount uint))
  (begin
    (map-set commitments {id: id} {from: tx-sender, to: to, amount: amount, confirmed: false})
    (ok true)
  )
)

(define-public (confirm-receipt (id uint))
  (let ((commit (map-get? commitments {id: id})))
    (match commit
      entry (if (is-eq (get to entry) tx-sender)
                (begin
                  (map-set commitments {id: id} (merge entry {confirmed: true}))
                  (ok true))
                (err u403))
      (err u404)
    )
  )
)

(define-read-only (get-commitment (id uint))
  (map-get? commitments {id: id}))
