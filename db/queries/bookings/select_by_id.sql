SELECT b.*, 
       g.full_name as guest_name,
       r.room_number,
       bs.is_booked, bs.is_paid, bs.is_cleaning
FROM bookings b
JOIN guests g ON b.guest_id = g.id
JOIN rooms r ON b.room_id = r.id
JOIN booking_status bs ON b.status_id = bs.id
WHERE b.id = ?; 