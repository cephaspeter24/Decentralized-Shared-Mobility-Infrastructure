;; Charging Station Registry Contract
;; Records details of EV charging locations

(define-data-var last-station-id uint u0)

(define-map stations
  { station-id: uint }
  {
    owner: principal,
    location: (string-utf8 100),
    power-capacity: uint,
    connector-types: (list 5 (string-utf8 20)),
    active: bool
  }
)

(define-public (register-station
                (location (string-utf8 100))
                (power-capacity uint)
                (connector-types (list 5 (string-utf8 20))))
  (let ((new-id (+ (var-get last-station-id) u1)))
    (var-set last-station-id new-id)
    (map-set stations
      { station-id: new-id }
      {
        owner: tx-sender,
        location: location,
        power-capacity: power-capacity,
        connector-types: connector-types,
        active: true
      }
    )
    (ok new-id)
  )
)

(define-public (update-station-status (station-id uint) (active bool))
  (let ((station (map-get? stations { station-id: station-id })))
    (asserts! (is-some station) (err u1)) ;; Station not found
    (asserts! (is-eq tx-sender (get owner (unwrap-panic station))) (err u2)) ;; Not the owner

    (map-set stations
      { station-id: station-id }
      (merge (unwrap-panic station) { active: active })
    )
    (ok true)
  )
)

(define-read-only (get-station (station-id uint))
  (map-get? stations { station-id: station-id })
)

(define-read-only (get-station-count)
  (var-get last-station-id)
)

