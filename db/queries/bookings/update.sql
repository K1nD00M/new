UPDATE bookings 
SET room_id = ?, guest_id = ?, check_in_date = ?, check_out_date = ?,
    status_id = ?, total_cost = ?, discount = ?, guest_count = ?
WHERE id = ?; 