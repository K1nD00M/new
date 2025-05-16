UPDATE guests 
SET full_name = ?, phone = ?, email = ?, passport = ?, 
    registration_date = ?, check_in_date = ?, guest_status = ?, loyalty_points = ?
WHERE id = ?; 