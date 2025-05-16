SELECT so.*, 
       s.name as service_name,
       b.check_in_date, b.check_out_date,
       g.full_name as guest_name
FROM service_orders so
JOIN services s ON so.service_id = s.id
JOIN bookings b ON so.booking_id = b.id
JOIN guests g ON b.guest_id = g.id
WHERE so.id = ?; 