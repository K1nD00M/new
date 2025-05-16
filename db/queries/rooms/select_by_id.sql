SELECT r.*, rt.name as room_type_name 
FROM rooms r 
JOIN room_types rt ON r.room_type_id = rt.id 
WHERE r.id = ?; 