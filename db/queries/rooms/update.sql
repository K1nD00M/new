UPDATE rooms 
SET room_number = ?, room_type_id = ?, price_per_night = ?, 
    capacity = ?, status = ?, review = ?
WHERE id = ?; 